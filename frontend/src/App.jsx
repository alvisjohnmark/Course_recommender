import { useState } from "react";
import "./App.css";
import {
  Search,
  BookOpen,
  Sparkles,
  X,
  ArrowRight,
  Star,
  Clock,
  Award,
} from "lucide-react";

function App() {
  const [interests, setInterests] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!interests.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: interests }),
      });

      const data = await res.json();

      setRecommendations(
        data.recommendations.map((course) => ({
          title: course.title,
          description: course.description,
        }))
      );
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    setInterests("");
    setRecommendations([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl mb-6 shadow-2xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Course
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent ml-3">
              Matcher
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover personalized learning paths tailored to your interests and
            career goals
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex flex-col space-y-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tell us about your interests... (e.g., web development, design, photography)"
                  className="w-full pl-16 pr-6 py-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-400/30 focus:border-purple-400/50 text-lg backdrop-blur-sm transition-all duration-300"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSearch}
                  disabled={!interests.trim() || isLoading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center space-x-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Finding Courses...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Get Recommendations</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleClear}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] border border-white/20"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {recommendations.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <Award className="w-8 h-8 mr-3 text-cyan-400" />
                Recommended for You
              </h2>
              <div className="text-gray-300 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                Top {recommendations.length} courses
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((course, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-3xl group"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {course.title}
                  </h3>

                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {course.description}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no search yet */}
        {recommendations.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/10">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              Ready to discover your next course?
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter your interests above and we'll recommend personalized
              courses just for you
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
