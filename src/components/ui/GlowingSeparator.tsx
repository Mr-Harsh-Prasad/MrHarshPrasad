'use client';

import { motion } from 'framer-motion';

export default function GlowingSeparator() {
    return (
        <div className="w-full h-16 relative overflow-hidden flex items-center justify-center -my-8 pointer-events-none z-10">
            <motion.div 
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "80%", opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                style={{ boxShadow: '0 0 15px rgba(0,255,255,0.8)' }}
            />
        </div>
    );
}
