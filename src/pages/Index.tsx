import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Mail, Phone, DollarSign } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    {
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies",
    },
    {
      title: "Design Services",
      description: "Professional UI/UX design and branding solutions",
    },
    {
      title: "Consulting",
      description: "Expert advice and strategy for your digital projects",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission (replace with actual backend call)
    setTimeout(() => {
      toast({
        title: "Order Received! ✅",
        description: "Thank you for your order! I'll contact you shortly.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        budget: "",
        message: "",
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-card rounded-[var(--radius)] card-shadow p-8 sm:p-12 animate-fade-in">
          
          {/* Header */}
          <header className="text-center mb-12 pb-8 border-b border-border">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
              Professional Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Quality, fast and on time
            </p>
          </header>

          {/* About Section */}
          <section className="mb-12 animate-slide-up">
            <h2 className="text-3xl font-bold text-foreground mb-6">About Me</h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              I professionally specialize in delivering high-quality services. With years of experience 
              and numerous successful projects completed, I guarantee quality execution of your orders. 
              My commitment is to excellence, timeliness, and your complete satisfaction.
            </p>
          </section>

          {/* Services Section */}
          <section className="mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-3xl font-bold text-foreground mb-6">My Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-muted/50 p-6 rounded-lg border-l-4 border-[hsl(var(--service-accent))] 
                           hover:bg-muted transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="bg-muted/30 rounded-lg p-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">Place an Order</h2>
              <p className="text-muted-foreground">
                Fill out the form below and I'll contact you shortly
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-semibold">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your full name"
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">
                  Email <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="bg-background pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-semibold">
                  Phone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="bg-background pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-foreground font-semibold">
                  Service Type
                </Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleInputChange("serviceType", value)}
                >
                  <SelectTrigger id="serviceType" className="bg-background">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-dev">Web Development</SelectItem>
                    <SelectItem value="design">Design Services</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-foreground font-semibold">
                  Budget (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    placeholder="5000"
                    className="bg-background pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground font-semibold">
                  Project Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Describe your project requirements..."
                  required
                  rows={5}
                  className="bg-background resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] 
                         hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg 
                         transition-all duration-300 hover:-translate-y-1 card-shadow-hover"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Submit Order
                  </>
                )}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
