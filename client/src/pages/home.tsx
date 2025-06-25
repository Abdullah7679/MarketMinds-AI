import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Brain, 
  BarChart3, 
  Shield, 
  Download,
  Chrome,
  Smartphone,
  Globe
} from 'lucide-react';

export default function Home() {
  const [downloadCount, setDownloadCount] = useState(1247);

  const features = [
    {
      icon: Brain,
      title: "AI Trading Assistant",
      description: "Expert-level insights powered by advanced AI, specializing in ICT and SMC methodologies",
      color: "text-purple-400"
    },
    {
      icon: TrendingUp,
      title: "Real-time Analysis",
      description: "Live market data integration with multi-timeframe analysis and trend identification",
      color: "text-blue-400"
    },
    {
      icon: BarChart3,
      title: "Smart Money Concepts",
      description: "Institutional order flow analysis, liquidity zones, and market structure insights",
      color: "text-pink-400"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Professional risk assessment tools and position sizing recommendations",
      color: "text-cyan-400"
    }
  ];

  const tradingModules = [
    "Trade Journal & Analytics",
    "Economic Calendar Integration", 
    "Alert & Notification System",
    "Sentiment Analysis",
    "Strategy Backtesting",
    "Learning & Education Hub",
    "Multi-Asset Support",
    "Customizable AI Personality",
    "Risk & Compliance Warnings",
    "Platform Integration"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                MarketMinds AI
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                <Globe className="w-3 h-3 mr-1" />
                Live
              </Badge>
              <Badge variant="outline" className="border-pink-400 text-pink-400">
                v1.0.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Professional Trading
              <br />
              <span className="text-white">Powered by AI</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              MarketMinds AI is your intelligent trading companion, providing expert-level market analysis, 
              risk management, and trading insights through an advanced AI assistant that understands 
              ICT, SMC, and institutional trading methodologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3">
                <Chrome className="w-5 h-5 mr-2" />
                Install Chrome Extension
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3">
                <Download className="w-5 h-5 mr-2" />
                Download Desktop App
              </Button>
            </div>
            <div className="mt-6 text-sm text-gray-400">
              <span>{downloadCount.toLocaleString()}+ traders trust MarketMinds AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-black/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-white">
              Advanced Trading Intelligence
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Leverage cutting-edge AI technology designed specifically for professional traders
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-900/50 to-black/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <feature.icon className={`w-8 h-8 ${feature.color} mb-2`} />
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Modules */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-4 text-white">
                Complete Trading Toolkit
              </h3>
              <p className="text-xl text-gray-300">
                10 powerful modules designed to enhance every aspect of your trading
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {tradingModules.map((module, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-cyan-400"></div>
                  <span className="text-white font-medium">{module}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Trading?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professional traders who rely on MarketMinds AI for superior market insights and risk management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4">
                <Chrome className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-4">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/50 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">MarketMinds AI</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 MarketMinds AI. Professional trading intelligence platform.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}