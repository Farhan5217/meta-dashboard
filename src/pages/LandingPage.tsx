import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Facebook, BarChart, PieChart, TrendingUp, Zap, Activity } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  const handleNavigation = (e) => {
    e.preventDefault(); // Prevent any default button behavior
    console.log('Navigating to /index');
    navigate('/index');
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700 relative overflow-hidden font-sans">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 dark:bg-blue-600/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/30 dark:bg-blue-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Logo Section */}
          <motion.div 
            variants={itemVariants}
            className="mb-8 flex items-center gap-4"
          >
            <motion.div
              animate={floatingAnimation}
              className="bg-white dark:bg-blue-800 p-4 rounded-2xl shadow-xl"
            >
              <Facebook className="w-12 h-12 text-blue-500 dark:text-blue-300" />
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            variants={itemVariants}
            className="font-display text-6xl font-bold text-blue-800 dark:text-blue-100 mb-6 tracking-tight leading-tight"
          >
            Meta Campaign Dashboard
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="font-body text-xl text-blue-700 dark:text-blue-200 mb-12 max-w-2xl leading-relaxed"
          >
            Transform your Meta advertising insights into actionable strategies with our powerful analytics dashboard
          </motion.p>

          {/* Features Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto"
          >
            {[
              { icon: BarChart, title: "Real-time Analytics" },
              { icon: PieChart, title: "Demographics Insights" },
              { icon: TrendingUp, title: "Performance Metrics" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/30 dark:bg-blue-800/30 backdrop-blur-lg rounded-2xl p-6 text-blue-800 dark:text-blue-100 hover:bg-white/40 dark:hover:bg-blue-700/40 transition-colors"
              >
                <motion.div animate={floatingAnimation}>
                  <feature.icon className="w-10 h-10 mb-4 mx-auto text-blue-600 dark:text-blue-300" />
                </motion.div>
                <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <Button
  onClick={handleNavigation}
  type="button"
  role="button"
  tabIndex={0}
  aria-label="Launch Dashboard"
  className="font-display bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg flex items-center gap-2 transition-all duration-300"
>
  <Zap className="w-5 h-5" />
  Launch Dashboard
  <Activity className="w-5 h-5" />
</Button>

          {/* Floating Elements */}
          <motion.div className="absolute top-40 right-20" animate={floatingAnimation}>
            <div className="w-20 h-20 bg-blue-200/40 dark:bg-blue-600/40 rounded-full blur-xl" />
          </motion.div>
          <motion.div className="absolute bottom-40 left-20" animate={{
            ...floatingAnimation,
            transition: { delay: 1 }
          }}>
            <div className="w-32 h-32 bg-blue-300/40 dark:bg-blue-500/40 rounded-full blur-xl" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;