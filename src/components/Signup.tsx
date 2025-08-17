import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Sparkles, LucideIcon, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AnimatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  togglePassword?: () => void;
}

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated background gradient
const AnimatedBackground = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5"
    animate={{
      background: [
        "linear-gradient(45deg, hsl(var(--primary))/5%, hsl(var(--secondary))/10%, hsl(var(--accent))/5%)",
        "linear-gradient(135deg, hsl(var(--secondary))/10%, hsl(var(--accent))/5%, hsl(var(--primary))/5%)",
        "linear-gradient(225deg, hsl(var(--accent))/5%, hsl(var(--primary))/5%, hsl(var(--secondary))/10%)",
        "linear-gradient(315deg, hsl(var(--primary))/5%, hsl(var(--secondary))/10%, hsl(var(--accent))/5%)",
      ],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

// Animated input field component
const AnimatedInput = ({ 
  icon: Icon, 
  label, 
  type = "text", 
  value, 
  onChange, 
  required = false,
  showPassword,
  togglePassword,
  ...props 
}: AnimatedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value.length > 0);
  }, [value]);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.label
        htmlFor={props.id}
        className={cn(
          "absolute left-12 transition-all duration-300 pointer-events-none z-10",
          (isFocused || hasValue)
            ? "text-xs text-primary -top-2 bg-card px-2 rounded"
            : "text-sm text-muted-foreground top-3"
        )}
        animate={{
          y: (isFocused || hasValue) ? -8 : 0,
          scale: (isFocused || hasValue) ? 0.85 : 1,
        }}
      >
        {label} {required && <span className="text-destructive">*</span>}
      </motion.label>
      
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 z-10",
            isFocused ? "text-primary" : "text-muted-foreground"
          )}
          animate={{
            scale: isFocused ? 1.1 : 1,
            color: isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
          }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={18} />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{
            boxShadow: isFocused
              ? "0 0 0 2px hsl(var(--primary)/20%), 0 0 20px hsl(var(--primary)/10%)"
              : "none",
          }}
          transition={{ duration: 0.3 }}
        />
        
        <Input
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-12 pr-12 py-3 bg-input/50 backdrop-blur-sm border-2 transition-all duration-300",
            "placeholder:text-transparent focus:bg-input focus:border-primary",
            hasValue && "bg-input"
          )}
          placeholder=" "
          {...props}
        />
        
        {type === "password" && (
          <motion.button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
            onClick={togglePassword}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {showPassword ? (
                <motion.div
                  key="eyeoff"
                  initial={{ opacity: 0, rotate: 180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -180 }}
                  transition={{ duration: 0.2 }}
                >
                  <EyeOff size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="eye"
                  initial={{ opacity: 0, rotate: 180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Eye size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

const SignUpCard = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = (password: string) => {
    const errorMessages = [];
    if (password.length < 8) {
      errorMessages.push("be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errorMessages.push("contain at least one uppercase letter");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errorMessages.push("contain at least one special character");
    }
    return errorMessages.length > 0 ? `Password must ${errorMessages.join(", ")}.` : "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let formIsValid = true;

    if (!name.trim()) {
      newErrors.name = "Full Name is required.";
      formIsValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
      formIsValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      formIsValid = false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
      formIsValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      formIsValid = false;
    }
    
    setErrors(newErrors);

    if (!formIsValid) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    setIsLoading(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      console.log("Sign up successful for:", { name, email });
      window.location.href = "/login";
    }, 1500);
  };

  const handleGoogleSignUp = () => {
    console.log("Signing up with Google...");
    // Here you would typically trigger the Google OAuth flow
  };

  return (
    <div className="flex w-full h-full items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl overflow-hidden rounded-3xl flex bg-card/80 backdrop-blur-xl shadow-2xl border border-border/50 relative z-10"
        style={{ 
          backgroundImage: "radial-gradient(circle at top right, hsl(var(--primary))/5%, transparent 50%)",
        }}
      >
        {/* Left side - Animated branding */}
        <motion.div 
          className="hidden lg:block w-1/2 h-[700px] relative overflow-hidden border-r border-border/50"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background/10 to-primary/5">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
              <motion.div 
                initial={{ opacity: 0, y: -30, scale: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8, type: "spring", bounce: 0.3 }}
                className="mb-8 relative"
              >
                <motion.div 
                  className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-2xl relative"
                  animate={{ 
                    rotate: 360
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="text-primary-foreground h-8 w-8" />
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="text-4xl font-bold mb-3 text-center relative"
              >
                <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                  IFLEON
                </span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-center text-muted-foreground max-w-sm leading-relaxed"
              >
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Join us and start your digital transformation journey.
                </motion.span>
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        {/* Right side - Form */}
        <motion.div 
          className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative z-10"
          >
            <motion.div className="mb-8">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-2 text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Create an Account
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                Begin your journey with us today.
              </motion.p>
            </motion.div>
            
            <motion.form 
              className="space-y-6"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <AnimatedInput
                id="name"
                icon={User}
                label="Full Name"
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              <AnimatedInput
                id="email"
                icon={Mail}
                label="Email address"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              <AnimatedInput
                id="password"
                icon={Lock}
                label="Password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                showPassword={isPasswordVisible}
                togglePassword={() => setIsPasswordVisible(!isPasswordVisible)}
                required
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              <AnimatedInput
                id="confirmPassword"
                icon={Lock}
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                showPassword={isConfirmPasswordVisible}
                togglePassword={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              
              <motion.div 
                className="pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "w-full h-12 bg-gradient-to-r relative overflow-hidden",
                      "from-primary via-primary/90 to-primary/80",
                      "hover:from-primary/90 hover:via-primary/80 hover:to-primary/70",
                      "text-primary-foreground rounded-xl transition-all duration-500",
                      "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
                      "border border-primary/20"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Creating Account...</span>
                        </motion.div>
                      ) : isSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                          >
                            ✓
                          </motion.div>
                          <span>Account Created!</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="signup"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <span className="font-medium">Create Account</span>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.4 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={handleGoogleSignUp}
                >
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                  Sign up with Google
                </Button>
              </motion.div>
              
              <motion.div 
                className="text-center mt-4 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.5 }}
              >
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary/80 font-medium relative group"
                >
                  Sign In
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-primary origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const Signup = () => {
  return (
    <motion.div 
      className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <AnimatedBackground />
      <FloatingParticles />
      
      <div className="relative z-10 w-full p-4">
        <SignUpCard />
      </div>
    </motion.div>
  );
};

export default Signup;
