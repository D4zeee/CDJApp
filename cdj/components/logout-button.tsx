'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogOut, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    setIsLoading(true);
    setShowConfirmDialog(false);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Redirect to login page
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOutClick = () => {
    setShowConfirmDialog(true);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleSignOutClick}
        disabled={isLoading}
        className="w-full border-[#919191]/30 text-[#919191] hover:bg-[#000000]/10 hover:text-[#FFFFFF] hover:border-[#FFFFFF]/30 rounded-xl transition-all duration-300 h-12"
      >
        <LogOut className="h-4 w-4 mr-2" />
        {isLoading ? 'Signing out...' : 'Sign Out'}
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-gradient-to-br from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F5] border border-[#E5E5E5] shadow-2xl max-w-md rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6B6B6B]/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-[#4A4A4A]/5 to-transparent rounded-full"></div>
          
          <div className="relative z-10">
            <DialogHeader className="text-center space-y-4 pt-4">
              <div className="space-y-3">
                <DialogTitle className="text-2xl font-bold text-[#2A2A2A] tracking-tight text-center">
                  Sign Out Confirmation
                </DialogTitle>
                <DialogDescription className="text-[#6B6B6B] text-base leading-relaxed px-2">
                  You're about to sign out of your account. Your session will end and you'll need to log in again to access your dashboard.
                </DialogDescription>
              </div>
            </DialogHeader>
            
            {/* Decorative divider */}
            <div className="flex items-center justify-center my-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#E5E5E5] to-transparent"></div>
              <div className="w-2 h-2 bg-[#E5E5E5] rounded-full mx-3"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#E5E5E5] to-transparent"></div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 border-[#D1D5DB] text-[#6B6B6B] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] hover:text-[#374151] rounded-xl font-semibold transition-all duration-300 h-12 shadow-sm hover:shadow-md transform hover:scale-[1.02] backdrop-blur-sm"
              >
                <span className="tracking-wide">Stay Signed In</span>
              </Button>
              <Button
                onClick={handleSignOut}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-[#6B6B6B] via-[#5A5A5A] to-[#4A4A4A] hover:from-[#5A5A5A] hover:via-[#4A4A4A] hover:to-[#3A3A3A] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] h-12 relative overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center">
                  <LogOut className="h-4 w-4 mr-2 drop-shadow-sm" />
                  <span className="tracking-wide">
                    {isLoading ? 'Signing Out...' : 'Sign Out'}
                  </span>
                </div>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}