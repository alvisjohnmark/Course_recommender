import { useState } from "react";
import "./App.css";
import {
  Search,
  BookOpen,
  Sparkles,
  X,
  ArrowRight,
  Award,
  Lightbulb,
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
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Course Matcher</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Discover personalized learning paths to your interests, hobbies and
            career goals.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell us your interests (e.g., AI, marketing, design)"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSearch}
                disabled={!interests.trim() || isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Finding...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Get Recommendations</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {recommendations.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award className="w-6 h-6 text-blue-600" />
                Recommended Courses
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {recommendations.length} suggestions
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((course, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold mb-2 text-blue-800">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{course.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recommendations.length === 0 && !isLoading && (
          <div className="text-center mt-20">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Ready to explore courses?
            </h3>
            <p className="text-gray-500">
              Type your interests and get tailored learning recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
