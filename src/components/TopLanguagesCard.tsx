import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Code2, FileCode, ArrowRight, Loader2 } from "lucide-react";
import { fetchToolUsage, Language } from "@/services/api";
import { useFirebaseUser } from "@/stores/useAuthHooks";

// Color palette for languages
const LANGUAGE_COLORS: Record<string, string> = {
  'JSON': '#F7DF1E',
  'Python': '#3776AB',
  'TypeScript': '#3178C6',
  'JavaScript': '#F7DF1E',
  'YAML': '#CB171E',
  'Markdown': '#083FA1',
  'HTML': '#E34C26',
  'CSS': '#563D7C',
  'Java': '#007396',
  'Go': '#00ADD8',
  'Rust': '#CE4833',
  'C++': '#00599C',
  'SQL': '#336791',
};

const getLanguageColor = (languageName: string): string => {
  return LANGUAGE_COLORS[languageName] || '#5B6FD8';
};

interface TopLanguagesCardProps {
  theme: 'light' | 'dark';
  onViewClick?: () => void;
}

export function TopLanguagesCard({ theme, onViewClick }: TopLanguagesCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [totalLines, setTotalLines] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalLanguages, setTotalLanguages] = useState(0);
  
  // Subscribe to firebaseUser from store
  const firebaseUser = useFirebaseUser();

  useEffect(() => {
    const loadLanguageData = async () => {
      try {
        // Only load if user exists
        if (!firebaseUser || !firebaseUser.email) {
          setIsLoading(false);
          setError(null);
          return;
        }
        
        setIsLoading(true);
        setError(null);
        
        const data = await fetchToolUsage();
        const langData = data.language_distribution.languages;
        
        setLanguages(langData);
        setTotalLines(data.language_distribution.summary.total_lines_of_code);
        setTotalFiles(data.language_distribution.summary.total_files);
        setTotalLanguages(data.language_distribution.summary.total_languages_used);
      } catch (err) {
        console.error('Failed to fetch language data:', err);
        const errMsg = err instanceof Error ? err.message : 'Failed to load language distribution';
        if (errMsg.includes('401') || errMsg.includes('Unauthorized')) {
          setError('Authentication failed. Please log in again');
        } else {
          setError(errMsg);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguageData();
  }, [firebaseUser?.uid]);
  
  return (
    <Card className={`p-8 rounded-3xl shadow-lg hover:shadow-xl backdrop-blur-2xl transition-all overflow-hidden relative ${
      theme === 'dark'
        ? 'bg-gray-800/50 border border-white/10'
        : 'bg-white/50 border border-white/60'
    }`}>
      {/* Decorative circles */}
      <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/15'
          : 'bg-gradient-to-br from-[#5B6FD8]/15 to-[#7C4DFF]/10'
      }`}></div>
      <div className={`absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#7C4DFF]/20 to-purple-600/15'
          : 'bg-gradient-to-br from-[#7C4DFF]/15 to-[#5B6FD8]/10'
      }`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center justify-between flex-1">
            <div>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Language Distribution</h3>
            </div>
            <Button
              onClick={onViewClick}
              size="sm"
              className={`group relative overflow-hidden px-4 py-2 rounded-lg transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-300 border border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20'
                  : 'bg-gradient-to-r from-[#5B6FD8]/10 to-[#7C4DFF]/10 hover:from-[#5B6FD8]/20 hover:to-[#7C4DFF]/20 text-[#5B6FD8] border border-[#5B6FD8]/30 hover:border-[#5B6FD8]/50 hover:shadow-lg hover:shadow-[#5B6FD8]/20'
              }`}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                View Details
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className={`w-6 h-6 animate-spin ${theme === 'dark' ? 'text-white/50' : 'text-gray-400'}`} />
          </div>
        ) : error ? (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>{error}</p>
          </div>
        ) : languages.length > 0 ? (
          <>
            {/* Featured Language Card */}
            {(() => {
              const topLanguage = languages[0];

              return (
                <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                        <Code2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Most Used</p>
                        <p className="text-xl">{topLanguage.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl">{topLanguage.percent.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 opacity-80" />
                      <span className="opacity-90">{topLanguage.loc.toLocaleString()} lines</span>
                    </div>
                    <div className="opacity-60">•</div>
                    <span className="opacity-90">{topLanguage.files} files</span>
                  </div>
                </div>
              );
            })()}

            {/* Language Grid */}
            <div className="grid grid-cols-2 gap-3">
              {languages.slice(1).map((lang, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-2xl backdrop-blur-xl transition-all group shadow-sm ${
                    theme === 'dark'
                      ? 'bg-gray-900/40 border border-white/10 hover:border-white/20 hover:bg-gray-900/60 hover:shadow-lg'
                      : 'bg-white/60 border border-white/60 hover:border-white/80 hover:bg-white/80 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className={`text-sm ${
                      theme === 'dark'
                        ? 'text-gray-300 group-hover:text-white'
                        : 'text-gray-700 group-hover:text-gray-900'
                    }`}>{lang.name}</p>
                    <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{lang.percent.toFixed(1)}%</p>
                  </div>
                  
                  {/* Circular Progress */}
                  <div className="relative w-full">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${lang.percent}%`,
                            backgroundColor: getLanguageColor(lang.name)
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className={`mt-2 flex items-center justify-between text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <span>{lang.loc.toLocaleString()} lines</span>
                      <span>{lang.files} files</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Divider */}
            <Separator className={`my-6 ${
              theme === 'dark' ? 'bg-white/10' : 'bg-gray-200/60'
            }`} />
            
            {/* Total Stats Row */}
            <div className="flex items-center justify-between gap-6">
              <div className={`flex-1 text-center p-3 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-900/30 border border-white/5' 
                  : 'bg-white/40 border border-white/40'
              }`}>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Total Lines</p>
                <p className={`text-lg mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{(totalLines / 1000).toFixed(1)}K</p>
              </div>
              
              <div className={`flex-1 text-center p-3 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-900/30 border border-white/5' 
                  : 'bg-white/40 border border-white/40'
              }`}>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Total Files</p>
                <p className={`text-lg mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{totalFiles}</p>
              </div>
              
              <div className={`flex-1 text-center p-3 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-900/30 border border-white/5' 
                  : 'bg-white/40 border border-white/40'
              }`}>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Total Languages</p>
                <p className={`text-lg mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{totalLanguages}</p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Card>
  );
}