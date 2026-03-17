import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Globe, LucideIcon } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface AnimatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  togglePassword?: () => void;
}

// Pulsing Stars for background
const PulsingStars = () => {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    size: 1 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white/50 rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Rotating Gradient Orbs for background
const RotatingOrbs = () => {
  const orbs = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    size: 50 + Math.random() * 50,
    delay: Math.random() * 4,
    duration: 10 + Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, hsl(var(--primary)/30%), transparent 70%)`,
          }}
          animate={{
            rotate: [0, 360],
            x: [0, Math.random() * 20 - 10, 0],
            y: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Wave Effect for background
const WaveEffect = () => {
  const waveX = useMotionValue(0);
  const backgroundPosition = useTransform(waveX, (x: number) => `${x}% 50%`);

  useEffect(() => {
    const controls = animate(waveX, [0, 100], {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
    });

    return () => controls.stop();
  }, [waveX]);

  return (
    <motion.div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `linear-gradient(
          90deg,
          transparent 0%,
          hsl(var(--secondary)/20%) 50%,
          transparent 100%
        )`,
        backgroundSize: "200% 100%",
        backgroundPosition,
      }}
    />
  );
};

// Enhanced Floating particles with more variety
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 3,
    size: 0.5 + Math.random() * 1.5,
    color: ["primary", "secondary", "accent"][Math.floor(Math.random() * 3)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full bg-${particle.color}/20`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [`${particle.y}%`, `${particle.y - 30}%`, `${particle.y}%`],
            x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`, `${particle.x}%`],
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

// More dynamic Animated background gradient with hue rotation
const AnimatedBackground = () => {
  const hue = useMotionValue(0);
  const background = useTransform(hue, (h: number) =>
    `linear-gradient(${h}deg, hsl(var(--primary)/5%), hsl(var(--secondary)/10%), hsl(var(--accent)/5%))`
  );

  useEffect(() => {
    const controls = animate(hue, [0, 360], {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    });

    return () => controls.stop();
  }, [hue]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ background }}
    />
  );
};

// Confetti burst component for success
const ConfettiBurst = () => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * -200 - 100,
    rotate: Math.random() * 360,
    color: ["primary", "secondary", "accent"][Math.floor(Math.random() * 3)],
    size: 4 + Math.random() * 8,
    duration: 1 + Math.random() * 1,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className={`absolute bg-${piece.color} rounded-sm`}
          style={{
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            left: '50%',
            top: '50%',
          }}
          initial={{
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: piece.x,
            y: piece.y,
            rotate: piece.rotate,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: piece.duration,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Animated input with glow and ripple effects
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
          isFocused || hasValue
            ? "text-xs text-primary -top-2 bg-card px-2 rounded"
            : "text-sm text-muted-foreground top-3"
        )}
        animate={{
          y: isFocused || hasValue ? -8 : 0,
          scale: isFocused || hasValue ? 0.85 : 1,
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

        {isFocused && (
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-lg"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
          />
        )}

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

interface User {
  email: string;
  password: string;
}

const SignInCard = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (user: User) => user.email === email && user.password === password
    );

    if (user) {
      setIsSuccess(true);
      setShowConfetti(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setTimeout(() => {
        setIsSuccess(false);
        setShowConfetti(false);
        console.log("Sign in successful for:", { email });
        window.location.href = "/";
      }, 2000);
    } else {
      console.log("Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex w-full h-full items-center justify-center relative">
      {/* <AnimatedBackground /> */}
      {/* <PulsingStars /> */}
      <RotatingOrbs />
      <WaveEffect />
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl overflow-hidden rounded-3xl flex bg-card/80 backdrop-blur-xl shadow-2xl border border-border/50 relative z-10"
        style={{
          backgroundImage: "radial-gradient(circle at top right, hsl(var(--primary))/5%, transparent 50%)",
        }}
      >
        {/* Left side - Enhanced "Map" with globe icon and more animations */}
        <motion.div
          className="hidden lg:block w-1/2 h-[700px] relative overflow-hidden border-r border-border/50"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background/10 to-primary/5">
            {/* Enhanced overlay with more animations */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8, type: "spring", bounce: 0.3 }}
                className="mb-8 relative"
              >
                <motion.div
                  className="h-24 w-24 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-2xl relative"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    <Globe className="text-primary-foreground h-12 w-12" />
                  </motion.div>

                  {/* Enhanced orbital rings with glow */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border border-primary/20 shadow-[0_0_10px_hsl(var(--primary)/20%)]"
                      style={{ padding: `${(i + 1) * 8}px` }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 15 + i * 5,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: i % 2 === 0 ? "loop" : "reverse",
                      }}
                    />
                  ))}
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
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
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
                  Connect to your digital transformation journey
                </motion.span>
              </motion.p>

              {/* Floating stats with count-up animation */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-8 flex space-x-6"
              >
                {[
                  { label: "Active Users", value: "10K+" },
                  { label: "Countries", value: "50+" },
                  { label: "Projects", value: "1K+" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="text-lg font-bold text-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 + i * 0.2, duration: 0.5 }}
                    >
                      <motion.span
                        animate={{
                          boxShadow: "0 0 5px hsl(var(--primary)/50%)",
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      >
                        {stat.value}
                      </motion.span>
                    </motion.div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Enhanced Form */}
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
            {/* Header with typing animation effect */}
            <motion.div className="mb-8">
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-2 text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <AnimatePresence>
                  {"Welcome back".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </AnimatePresence>
                <motion.span
                  className="inline-block ml-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  👋
                </motion.span>
              </motion.h1>
              <motion.p
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                Sign in to continue your journey
              </motion.p>
            </motion.div>

            {/* Enhanced Google button with logo animation */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <motion.button
                className="w-full flex items-center justify-center gap-3 bg-secondary/50 border-2 border-border/50 rounded-xl p-4 transition-all duration-300 text-secondary-foreground shadow-lg backdrop-blur-sm relative overflow-hidden group"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px hsl(var(--secondary)/20%)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => console.log("Google sign-in")}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full"
                  transition={{ duration: 0.6 }}
                />
                <motion.svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </motion.svg>
                <span className="font-medium">Continue with Google</span>
              </motion.button>
            </motion.div>

            {/* Animated divider with glow */}
            <motion.div
              className="relative my-8"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className="absolute inset-0 flex items-center">
                <motion.div
                  className="w-full border-t border-border"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                />
              </div>
              <div className="relative flex justify-center text-sm">
                <motion.span
                  className="px-4 bg-card text-muted-foreground"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.6 }}
                >
                  or
                </motion.span>
              </div>
            </motion.div>

            {/* Enhanced form */}
            <motion.form
              className="space-y-6"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <AnimatedInput
                id="email"
                icon={Mail}
                label="Email address"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />

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

              <motion.div
                className="pt-4 relative"
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
                      "from-green-400 to-yellow-400",
                      "hover:from-green-500 hover:to-yellow-500",
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
                          <span>Signing in...</span>
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
                          <span>Welcome back!</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="signin"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <span className="font-medium">Sign in</span>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </Button>
                </motion.div>
                {showConfetti && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <ConfettiBurst />
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>

              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.4 }}
              >
                <Link
                  to="/forgot-password"
                  className="text-primary hover:text-primary/80 text-sm transition-colors font-medium relative group"
                >
                  Forgot password?
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-primary origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
              <motion.div
                className="text-center mt-4 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.5 }}
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary/80 font-medium relative group"
                >
                  Create an account
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

const Login = () => {
  return (
    <motion.div
      className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <AnimatedBackground />
      <PulsingStars />
      <RotatingOrbs />
      <WaveEffect />
      <FloatingParticles />

      {/* Enhanced Grid pattern with animation */}
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px", "0px 0px"],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full p-4">
        <SignInCard />
      </div>
    </motion.div>
  );
};

export default Login;
