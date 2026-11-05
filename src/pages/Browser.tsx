import React, { useMemo, useState } from 'react';
import {
  Search,
  Calculator,
  FileText,
  FilePdf,
  BriefcaseBusiness,
  ArrowRight,
  Clock,
  Sparkles,
  Percent,
  Wallet,
  HeartPulse,
  TrendingUp,
  Coins,
  Banknote,
  CalendarDays,
  GraduationCap,
  FilePlus,
  Combine,
  Scissors,
  Minimize2,
  Image,
  RefreshCw,
  ChevronRight,
  X,
  Home,
  Menu
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Tool = {
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
};

const tools: Tool[] = [
  // CALCULATORS
  { name: 'Percentage Calculator', description: 'Calculate percentages and proportions.', category: 'Calculators', icon: Percent },
  { name: 'Discount Calculator', description: 'Find sale prices and savings.', category: 'Calculators', icon: Percent },
  { name: 'BMI Calculator', description: 'Estimate your body mass index.', category: 'Calculators', icon: HeartPulse },
  { name: 'Loan Payment Calculator', description: 'Estimate monthly loan repayments.', category: 'Calculators', icon: Wallet },
  { name: 'Compound Interest Calculator', description: 'Calculate how savings grow over time.', category: 'Calculators', icon: TrendingUp },
  { name: 'Salary Converter', description: 'Convert salary into different time periods.', category: 'Calculators', icon: Banknote },
  { name: 'Simple Interest Calculator', description: 'Calculate simple interest.', category: 'Calculators', icon: Coins },
  { name: 'Age Calculator', description: 'Calculate your age in years and days.', category: 'Calculators', icon: CalendarDays },
  { name: 'Profit Calculator', description: 'Calculate business profit and margins.', category: 'Calculators', icon: TrendingUp },
  { name: 'Tax Calculator', description: 'Estimate tax deductions.', category: 'Calculators', icon: Banknote },
  { name: 'Tip Calculator', description: 'Calculate tips and split bills.', category: 'Calculators', icon: Coins },
  { name: 'Average Calculator', description: 'Find the average of numbers.', category: 'Calculators', icon: Calculator },
  { name: 'Date Calculator', description: 'Calculate the difference between dates.', category: 'Calculators', icon: CalendarDays },
  { name: 'Time Calculator', description: 'Calculate time durations.', category: 'Calculators', icon: Clock },
  { name: 'Currency Calculator', description: 'Convert between currencies.', category: 'Calculators', icon: Wallet },
  { name: 'GST Calculator', description: 'Calculate tax-inclusive and exclusive prices.', category: 'Calculators', icon: Banknote },
  { name: 'Unit Converter', description: 'Convert common measurement units.', category: 'Calculators', icon: RefreshCw },

  // CV AND RESUME
  { name: 'CV Builder', description: 'Create a professional CV.', category: 'CV & Resume', icon: FileText },
  { name: 'Resume Builder', description: 'Create a clean one-page resume.', category: 'CV & Resume', icon: BriefcaseBusiness },
  { name: 'Cover Letter Generator', description: 'Prepare a professional cover letter.', category: 'CV & Resume', icon: FilePlus },
  { name: 'Professional Summary', description: 'Write a strong career summary.', category: 'CV & Resume', icon: Sparkles },
  { name: 'Skills Generator', description: 'Discover relevant skills for a job.', category: 'CV & Resume', icon: GraduationCap },
  { name: 'Interview Preparation', description: 'Prepare answers for job interviews.', category: 'CV & Resume', icon: BriefcaseBusiness },

  // PDF TOOLS
  { name: 'Merge PDF', description: 'Combine multiple PDF documents.', category: 'PDF Tools', icon: Combine },
  { name: 'Split PDF', description: 'Separate PDF pages.', category: 'PDF Tools', icon: Scissors },
  { name: 'Compress PDF', description: 'Reduce PDF file size.', category: 'PDF Tools', icon: Minimize2 },
  { name: 'PDF to Images', description: 'Convert PDF pages into images.', category: 'PDF Tools', icon: Image },
  { name: 'Images to PDF', description: 'Turn images into a PDF document.', category: 'PDF Tools', icon: FilePdf },
  { name: 'Rotate PDF', description: 'Rotate PDF pages.', category: 'PDF Tools', icon: RefreshCw },
  { name: 'Extract PDF Pages', description: 'Save selected PDF pages.', category: 'PDF Tools', icon: FilePlus },
  { name: 'Delete PDF Pages', description: 'Remove unwanted PDF pages.', category: 'PDF Tools', icon: X }
];

const categories = [
  {
    name: 'Calculators',
    short: 'CALC',
    count: 17,
    description: 'Make decisions with simple calculations.',
    icon: Calculator
  },
  {
    name: 'CV & Resume',
    short: 'CV',
    count: 6,
    description: 'Create professional career documents.',
    icon: BriefcaseBusiness
  },
  {
    name: 'PDF Tools',
    short: 'PDF',
    count: 8,
    description: 'Manage and prepare your PDF files.',
    icon: FilePdf
  }
];

const Browser: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Tools');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory =
        category === 'All Tools' || tool.category === category;

      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const selectTool = (tool: Tool) => {
    setSelectedTool(tool);

    setRecent(previous => [
      tool.name,
      ...previous.filter(name => name !== tool.name)
    ].slice(0, 5));
  };

  const Icon = selectedTool?.icon;

  return (
    <div className="min-h-full bg-background">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>

            <div>
              <h1 className="font-bold text-lg leading-tight">
                Kingkwabie
              </h1>
              <p className="text-xs text-muted-foreground">
                AI Tools
              </p>
            </div>
          </div>

          <span className="text-xs border rounded-full px-3 py-1">
            Free tools
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-7 space-y-9">

        {/* HERO */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            MADE FOR THE IN-BETWEEN MOMENTS
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Useful tools.
            <br />
            <span className="text-primary">
              All in one place.
            </span>
          </h2>

          <p className="text-muted-foreground max-w-lg">
            Free tools for calculations, careers and PDF documents.
            Simple, useful and easy to access.
          </p>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setCategory('Calculators')}>
              <Calculator className="w-4 h-4 mr-2" />
              Calculators
            </Button>

            <Button
              variant="outline"
              onClick={() => setCategory('CV & Resume')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Resume
            </Button>

            <Button
              variant="outline"
              onClick={() => setCategory('PDF Tools')}
            >
              <FilePdf className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </section>

        {/* SEARCH */}
        <section>
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />

            <Input
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCategory('All Tools');
              }}
              placeholder="Search all 31 tools..."
              className="h-12 pl-11 rounded-xl"
            />
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-primary">
              THE TOOLKIT
            </p>
            <h3 className="text-2xl font-bold mt-1">
              Three places to start
            </h3>
            <p className="text-sm text-muted-foreground">
              No sign-in. No clutter.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {categories.map(item => {
              const CategoryIcon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setCategory(item.name);
                    setSearch('');
                    setSelectedTool(null);
                  }}
                  className={`text-left border rounded-2xl p-5 transition-all hover:border-primary ${
                    category === item.name
                      ? 'border-primary bg-primary/5'
                      : 'bg-card'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <CategoryIcon className="w-7 h-7 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      {item.short}
                    </span>
                  </div>

                  <h4 className="font-bold text-lg mt-5">
                    {item.name}
                  </h4>

                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-5">
                    <span className="text-xs font-medium">
                      {item.count} useful tools
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* RECENT TOOLS */}
        {recent.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">
                Recently opened
              </h3>
            </div>

            <div className="flex gap-2 flex-wrap">
              {recent.map(name => (
                <span
                  key={name}
                  className="border rounded-full px-3 py-2 text-xs"
                >
                  {name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* TOOL LIST */}
        <section className="space-y-4">

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-semibold text-primary">
                EXPLORE
              </p>

              <h3 className="text-2xl font-bold mt-1">
                {category === 'All Tools' ? 'All tools' : category}
              </h3>

              <p className="text-sm text-muted-foreground">
                {filteredTools.length} tools available in this directory.
              </p>
            </div>

            {category !== 'All Tools' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCategory('All Tools')}
              >
                View all
              </Button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {filteredTools.map((tool, index) => {
              const ToolIcon = tool.icon;

              return (
                <button
                  key={tool.name}
                  onClick={() => selectTool(tool)}
                  className="flex items-center gap-3 text-left p-4 rounded-xl border bg-card hover:border-primary transition-colors"
                >
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ToolIcon className="w-5 h-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </p>

                    <h4 className="font-semibold text-sm">
                      {tool.name}
                    </h4>

                    <p className="text-xs text-muted-foreground mt-1">
                      {tool.description}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No matching tools found.
            </div>
          )}
        </section>

        {/* PRIVACY */}
        <section className="rounded-2xl bg-primary/5 border p-6 space-y-3">
          <p className="text-xs font-semibold text-primary">
            A QUIET PROMISE
          </p>

          <h3 className="text-2xl font-bold">
            Your work should not become our data.
          </h3>

          <p className="text-sm text-muted-foreground">
            Kingkwabie AI Tools is designed with privacy in mind.
            We aim to process your documents locally whenever possible.
          </p>

          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Privacy-first approach
          </div>
        </section>

      </main>

      {/* TOOL INFORMATION PANEL */}
      {selectedTool && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center p-3">

          <div className="bg-background w-full max-w-md rounded-2xl p-6 space-y-5">

            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {Icon && <Icon className="w-6 h-6 text-primary" />}
              </div>

              <button onClick={() => setSelectedTool(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div>
              <p className="text-xs text-primary font-semibold">
                {selectedTool.category}
              </p>

              <h3 className="text-xl font-bold mt-1">
                {selectedTool.name}
              </h3>

              <p className="text-sm text-muted-foreground mt-2">
                {selectedTool.description}
              </p>
            </div>

            <div className="rounded-xl border p-4 text-sm text-muted-foreground">
              This tool is listed in your Kingkwabie toolkit.
              Its working interface will be connected in the next development step.
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => setSelectedTool(null)}
            >
              Back to all tools
            </Button>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t mt-10 p-6 text-center">
        <p className="font-bold">kingkwabie</p>
        <p className="text-xs text-muted-foreground mt-1">
          Free tools for calculations, careers and PDFs.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          © 2026 Kingkwabie AI Tools
        </p>
      </footer>

    </div>
  );
};

export default Browser;
