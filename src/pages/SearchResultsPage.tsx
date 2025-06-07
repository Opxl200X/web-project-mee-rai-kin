import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecipeStore } from '../store/recipeStore';
import RecipeCard from '../components/recipe/RecipeCard';
import { Search, X, Menu } from 'lucide-react';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchQueryRaw = queryParams.get('q') || '';
  const decodedSearchQuery = decodeURIComponent(searchQueryRaw);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { searchRecipes, searchResults } = useRecipeStore();

  const filters = [
    'มังสวิรัติ',
    'ฮาลาล',
    'คีโต',
    'โปรตีนสูง',
    'ฟาสต์ฟู้ด',
    'อาหารเจ',
    'อาหารคลีน',
    'สุขภาพ'
  ];

  useEffect(() => {
    searchRecipes(decodedSearchQuery, selectedFilters);
  }, [decodedSearchQuery, selectedFilters, searchRecipes]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearAll = () => {
    setSelectedFilters([]);
    navigate('/search');
  };

  return (
    <div className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">ผลการค้นหา</h1>

        {/* ปุ่มตัวกรองสำหรับ Mobile - ย้ายไปด้านซ้าย */}
        <div className="lg:hidden mb-4 flex justify-start">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-full shadow"
          >
            <Menu size={20} />
            ตัวกรอง
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ตัวกรอง - Desktop */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-secondary rounded-xl p-4 sticky top-24">
              <h2 className="text-xl font-bold mb-4">ตัวกรอง</h2>
              <div className="space-y-3">
                {filters.map(filter => (
                  <button
                    key={filter}
                    className={`w-full py-2 px-4 rounded-full text-left transition-colors duration-300 ${
                      selectedFilters.includes(filter)
                        ? 'bg-[#ff69b4] text-white'
                        : 'bg-white border-2 border-[#ff69b4] hover:bg-pink-100'
                    }`}
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedFilters([])}
                  className="mt-4 w-full py-2 px-4 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors duration-300"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            </div>
          </div>

          {/* ตัวกรอง - Mobile Overlay */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-start justify-start p-4 lg:hidden">
              <div className="bg-white w-80 max-w-full h-full rounded-lg shadow-lg p-6 overflow-y-auto relative">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  <X size={24} />
                </button>
                <h2 className="text-xl font-bold mb-4">ตัวกรอง</h2>
                <div className="space-y-3">
                  {filters.map(filter => (
                    <button
                      key={filter}
                      className={`w-full py-2 px-4 rounded-full text-left transition-colors duration-300 ${
                        selectedFilters.includes(filter)
                          ? 'bg-[#ff69b4] text-white'
                          : 'bg-white border-2 border-[#ff69b4] hover:bg-pink-100'
                      }`}
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedFilters([])}
                    className="mt-4 w-full py-2 px-4 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors duration-300"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="flex-1">
            <form className="mb-6" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาเมนูอาหาร..."
                  value={decodedSearchQuery}
                  readOnly
                  className="w-full py-3 px-5 pr-12 bg-pink-100 rounded-full text-gray-800 cursor-not-allowed"
                />
                {decodedSearchQuery && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
                  >
                    <X size={18} />
                  </button>
                )}
                <button
                  type="submit"
                  disabled
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-not-allowed"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">
                  ไม่พบเมนูอาหารที่ตรงกับการค้นหา "{decodedSearchQuery}"
                </p>
                <p className="text-gray-500">
                  ลองค้นหาด้วยคำอื่น หรือเลือกเมนูจากหมวดหมู่ด้านซ้าย
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
