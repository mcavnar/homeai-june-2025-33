
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { normalizeTextForSearch } from '@/utils/textNormalization';

interface PDFRecoveryResult {
  pdf_file_path: string;
  pdf_text: string;
  pdf_metadata: any;
}

export const usePDFRecovery = (
  userReport: any,
  onRecoveryComplete?: (result: PDFRecoveryResult) => void
) => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoveryAttempted, setRecoveryAttempted] = useState(false);

  useEffect(() => {
    const attemptPDFRecovery = async () => {
      // Only attempt recovery if:
      // 1. We have a user report
      // 2. The PDF file path is missing
      // 3. We have a property address to match against
      // 4. We haven't already attempted recovery
      if (!userReport || 
          userReport.pdf_file_path || 
          !userReport.property_address || 
          recoveryAttempted) {
        return;
      }

      console.log('PDF Recovery: Starting background recovery for address:', userReport.property_address);
      
      // Defer PDF recovery to run after other critical components load
      setTimeout(async () => {
        try {
          setIsRecovering(true);
          setRecoveryError(null);
          setRecoveryAttempted(true);

          const propertyAddress = userReport.property_address;
          
          // First attempt: Exact address match
          console.log('PDF Recovery: Attempting exact address match');
          let { data: exactMatch, error: exactError } = await supabase
            .from('anonymous_reports')
            .select('pdf_file_path, pdf_text, pdf_metadata, created_at')
            .eq('property_address', propertyAddress)
            .not('pdf_file_path', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (exactError) {
            console.error('PDF Recovery: Error in exact match query:', exactError);
          }

          let recoveredData = exactMatch;

          // Second attempt: Fuzzy address matching if exact match fails
          if (!recoveredData) {
            console.log('PDF Recovery: Attempting fuzzy address match');
            const normalizedAddress = normalizeTextForSearch(propertyAddress);
            
            const { data: allReports, error: fuzzyError } = await supabase
              .from('anonymous_reports')
              .select('pdf_file_path, pdf_text, pdf_metadata, property_address, created_at')
              .not('pdf_file_path', 'is', null)
              .not('property_address', 'is', null)
              .order('created_at', { ascending: false })
              .limit(50); // Limit to recent reports for performance

            if (fuzzyError) {
              console.error('PDF Recovery: Error in fuzzy match query:', fuzzyError);
            } else if (allReports) {
              // Find the best fuzzy match
              const fuzzyMatch = allReports.find(report => {
                const normalizedReportAddress = normalizeTextForSearch(report.property_address || '');
                return normalizedReportAddress === normalizedAddress;
              });

              if (fuzzyMatch) {
                recoveredData = fuzzyMatch;
                console.log('PDF Recovery: Found fuzzy match for address');
              }
            }
          }

          if (recoveredData) {
            console.log('PDF Recovery: Successfully recovered PDF data');
            const result: PDFRecoveryResult = {
              pdf_file_path: recoveredData.pdf_file_path,
              pdf_text: recoveredData.pdf_text || '',
              pdf_metadata: recoveredData.pdf_metadata || null,
            };

            // Call the callback to update the user report
            if (onRecoveryComplete) {
              onRecoveryComplete(result);
            }
          } else {
            console.log('PDF Recovery: No matching anonymous report found');
            setRecoveryError('No matching PDF found in anonymous reports');
          }
        } catch (error) {
          console.error('PDF Recovery: Unexpected error during recovery:', error);
          setRecoveryError('Failed to recover PDF data');
        } finally {
          setIsRecovering(false);
        }
      }, 2500); // 2.5 second delay to ensure other components load first
    };

    attemptPDFRecovery();
  }, [userReport, onRecoveryComplete, recoveryAttempted]);

  return {
    isRecovering,
    recoveryError,
    recoveryAttempted,
  };
};
