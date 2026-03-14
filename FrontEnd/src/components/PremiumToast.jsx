import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

/**
 * PremiumToast - A standardized high-end notification component.
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the toast
 * @param {string} props.message - The notification message
 * @param {'success' | 'error'} props.type - The theme of the toast
 * @param {Function} props.onClose - Function to call when toast should be closed
 */
const PremiumToast = ({ show, message, type = "error", onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          className="fixed top-6 right-6 z-[1000] bg-white rounded-none border-l-4 border-[#32CD32] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center min-w-[320px] max-w-md overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 h-1 bg-[#32CD32] shadow-[0_0_10px_#32CD32]"
            style={{
              width: '100%',
              animation: 'premiumToastProgress 3s linear forwards'
            }}
          />
          <div className="p-4 flex items-center gap-4 w-full">
            <div className={`w-10 h-10 ${type === 'success' ? 'bg-[#32CD32]' : 'bg-red-500'} flex items-center justify-center shadow-lg ${type === 'success' ? 'shadow-[#32CD32]/20' : 'shadow-red-500/20'} shrink-0`}>
              {type === 'success' ? <CheckCircle2 className="text-white" size={18} /> : <X className="text-white" size={18} />}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 truncate">
                {type === 'success' ? 'Success Notification' : 'System Alert'}
              </span>
              <span className="text-xs font-black text-[#025622] uppercase tracking-wide leading-tight break-words">
                {message}
              </span>
            </div>
            <button onClick={onClose} className="p-1 text-gray-300 hover:text-gray-500 transition-colors shrink-0">
              <X size={16} />
            </button>
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes premiumToastProgress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumToast;
