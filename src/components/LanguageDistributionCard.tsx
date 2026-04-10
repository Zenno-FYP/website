import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { fetchToolUsage, Language, LanguageSummary } from "@/services/api";
import { Loader2 } from "lucide-react";
import { useFirebaseUser } from "@/stores/useAuthHooks";

interface LanguageDistributionCardProps {
  theme: 'light' | 'dark';
}

// Color palette for languages
const LANGUAGE_COLORS = [
  '#FF6B9D',
  '#5B6FD8',
  '#4ECDC4',
  '#FFD93D',
  '#9B59B6',
  '#00ED64',
  '#FB542B',
  '#0078D4',
  '#FF8C42',
  '#44A6A0',
];

const getColorForLanguage = (index: number): string => {
  return LANGUAGE_COLORS[index % LANGUAGE_COLORS.length];
};

export function LanguageDistributionCard({ theme }: LanguageDistributionCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [summary, setSummary] = useState<LanguageSummary | null>(null);
  
  // Subscribe to firebaseUser from store
  const firebaseUser = useFirebaseUser();

  useEffect(() => {
    const loadToolUsage = async () => {
      try {
        // Only load if user exists
        if (!firebaseUser || !firebaseUser.email) {
          setIsLoading(false);
          setError(null);
          return;
        }
        
        setIsLoading(true);
        setError(null);
        
        // Get fresh token to ensure session is valid
        await firebaseUser.getIdToken(true);
        console.log('Loading language distribution chart for user:', firebaseUser.email);
        
        const data = await fetchToolUsage();
        setLanguages(data.language_distribution.languages);
        setSummary(data.language_distribution.summary);
      } catch (err) {
        console.error('Failed to fetch tool usage:', err);
        const errMsg = err instanceof Error ? err.message : 'Failed to load language distribution data';
        if (errMsg.includes('401') || errMsg.includes('Unauthorized')) {
          setError('Authentication failed. Please log in again');
        } else {
          setError(errMsg);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadToolUsage();
  }, [firebaseUser?.uid]);

  // Prepare data for pie chart
  const chartData = languages.map((lang, idx) => ({
    name: lang.name,
    value: Number(lang.percent.toFixed(1)),
    color: getColorForLanguage(idx),
  }));

  return (
    <Card className={`p-6 rounded-3xl shadow-lg hover:shadow-xl backdrop-blur-2xl transition-all cursor-pointer overflow-hidden relative ${
      theme === 'dark'
        ? 'bg-gray-800/50 border border-white/10 hover:bg-gray-800/70'
        : 'bg-white/50 border border-white/60 hover:bg-white/70'
    }`}>
      {/* Decorative gradient */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-green-600/15 to-transparent'
          : 'bg-gradient-to-br from-[#4ECDC4]/10 to-transparent'
      }`}></div>
      <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl -z-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#00ED64]/10 to-transparent'
          : 'bg-gradient-to-br from-[#4ECDC4]/5 to-transparent'
      }`}></div>

      <div className="relative z-10">
        <div className="mb-6">
          <h3 className={`mb-1.5 font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Language Distribution</h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className={`w-6 h-6 animate-spin ${theme === 'dark' ? 'text-white/50' : 'text-gray-400'}`} />
          </div>
        ) : error ? (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            {summary && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className={`p-3 rounded-xl text-center backdrop-blur-xl border transition-all ${
                  theme === 'dark'
                    ? 'border-white/5 bg-white/5 hover:bg-white/10'
                    : 'border-gray-100/50 bg-white/30 hover:bg-white/50'
                }`}>
                  <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Lines of Code</p>
                  <p className={`text-lg font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{summary.total_lines_of_code.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-xl text-center backdrop-blur-xl border transition-all ${
                  theme === 'dark'
                    ? 'border-white/5 bg-white/5 hover:bg-white/10'
                    : 'border-gray-100/50 bg-white/30 hover:bg-white/50'
                }`}>
                  <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Files</p>
                  <p className={`text-lg font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{summary.total_files}</p>
                </div>
                <div className={`p-3 rounded-xl text-center backdrop-blur-xl border transition-all ${
                  theme === 'dark'
                    ? 'border-white/5 bg-white/5 hover:bg-white/10'
                    : 'border-gray-100/50 bg-white/30 hover:bg-white/50'
                }`}>
                  <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Languages</p>
                  <p className={`text-lg font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{summary.total_languages_used}</p>
                </div>
              </div>
            )}

            {/* Pie Chart */}
            {chartData.length > 0 && (
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value}%`}
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Languages List */}
            <div className="space-y-2.5">
              {languages.map((language, index) => (
                <div 
                  key={index}
                  className={`p-3.5 rounded-xl backdrop-blur-xl border transition-all ${
                    theme === 'dark'
                      ? 'border-white/5 hover:bg-white/10 hover:border-white/20'
                      : 'border-gray-100/50 hover:bg-white/60 hover:border-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getColorForLanguage(index) }}
                      ></div>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{language.name}</p>
                    </div>
                    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{language.percent.toFixed(1)}%</p>
                  </div>
                  <div className={`relative w-full h-1.5 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-700/80' : 'bg-gray-200/60'
                  }`}>
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${language.percent}%`,
                        backgroundColor: getColorForLanguage(index)
                      }}
                    ></div>
                  </div>
                  <div className={`flex items-center justify-between mt-2 text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <span>{language.loc.toLocaleString()} LOC</span>
                    <span>{language.files} file{language.files !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
