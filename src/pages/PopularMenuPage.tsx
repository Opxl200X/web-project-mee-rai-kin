import { useRecipeStore } from '../store/recipeStore';
import { useNavigate } from 'react-router-dom';

const PopularMenuPage = () => {
  const { recipes } = useRecipeStore();
  const navigate = useNavigate();

  const handleMenuClick = (id: string) => {
    navigate(`/menu/${id}`);
  };

  const topRecipes = [...recipes]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const heights = [450, 420, 390, 360, 330];
  const barColors = [
    { base: '#ff5c5c', hover: '#ff4040' },
    { base: '#ffd93b', hover: '#ffeb3b' },
    { base: '#3bff3b', hover: '#3bff75' },
    { base: '#5caeff', hover: '#5cb8ff' },
    { base: '#ff5cff', hover: '#ff6bff' },
  ];

  const barWidth = 160;

  return (
    <section className="py-8 px-4 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-pink-200 py-6 rounded-xl text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">เมนูยอดนิยมจากจำนวนผู้ชม</h1>
        </div>

        <div className="flex flex-wrap justify-center gap-10 md:gap-20 mt-8 md:mt-24 items-end">
          {topRecipes.map((recipe, index) => (
            <div key={recipe.id} className="flex flex-col items-center" style={{ width: `${barWidth}px` }}>
              <div
                className="relative cursor-pointer transition-all duration-400 ease-out"
                style={{
                  height: `${heights[index]}px`,
                  width: `${barWidth}px`,
                  backgroundColor: barColors[index].base,
                  borderRadius: '10px 10px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: '40px',
                  boxSizing: 'border-box',
                  position: 'relative',
                  flexShrink: 0,
                }}
                onClick={() => handleMenuClick(recipe.id)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = barColors[index].hover;
                  e.currentTarget.style.transform = 'scale(1.05) rotate(5deg)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.25)';
                  const imgBox = e.currentTarget.querySelector('.rotating-image');
                  if (imgBox) imgBox.style.transform = 'rotate(360deg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = barColors[index].base;
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = 'none';
                  const imgBox = e.currentTarget.querySelector('.rotating-image');
                  if (imgBox) imgBox.style.transform = 'rotate(0deg)';
                }}
              >
                <div
                  className="absolute top-[-70px] w-28 h-28 md:w-32 md:h-32 bg-white rounded-full overflow-hidden flex items-center justify-center border-4 border-gray-200 rotating-image"
                  style={{ transition: 'transform 0.6s ease' }}
                >
                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                </div>
                <span className="text-2xl md:text-3xl font-bold mb-2">{index + 1}</span>
              </div>

              <div className="mt-4 text-center w-full" style={{ minHeight: '4rem' }}>
                <h3 className="font-semibold text-lg md:text-xl">{recipe.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularMenuPage;
