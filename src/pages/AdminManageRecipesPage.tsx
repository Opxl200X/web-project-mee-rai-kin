import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AdminNavbar from '../components/layout/AdminNavbar';
import Footer from '../components/layout/Footer';
import { useRecipeStore, Recipe, Ingredient } from '../store/recipeStore';

const emptyRecipe: Recipe = {
  id: '',
  title: '',
  imageUrl: '',
  cookTime: 0,
  difficulty: 'easy',
  calories: 0,
  ingredients: [],
  steps: [],
  diet_type: '',
  videoUrl: '',
};

const AdminManageRecipesPage = () => {
  const { recipes, addRecipe, updateRecipe, deleteRecipe } = useRecipeStore();
  const [formData, setFormData] = useState<Recipe>(emptyRecipe);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cookTime' || name === 'calories' ? +value : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateRecipe(formData);
    } else {
      addRecipe({ ...formData, id: uuidv4() });
    }
    setFormData(emptyRecipe);
    setIsEditing(false);
    setShowEditPanel(false);
  };

  const handleEdit = (recipe: Recipe) => {
    setFormData(recipe);
    setIsEditing(true);
    setShowEditPanel(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบเมนูนี้หรือไม่?')) {
      deleteRecipe(id);
    }
  };

  const updateIngredient = (index: number, key: keyof Ingredient, value: string | number) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [key]: value };
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const updateStep = (index: number, value: string) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = value;
    setFormData({ ...formData, steps: updatedSteps });
  };

  return (
    <>
      <AdminNavbar />
      <main className="pt-24 min-h-screen bg-yellow-100 px-4 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">จัดการเมนูอาหาร</h1>

          <button
            onClick={() => {
              setFormData(emptyRecipe);
              setIsEditing(false);
              setShowEditPanel(true);
            }}
            className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            ➕ เพิ่มเมนูใหม่
          </button>

          <div className="bg-white p-6 rounded-lg shadow mb-10">
            <h2 className="text-xl font-semibold mb-4">รายการเมนูทั้งหมด</h2>
            {recipes.length === 0 ? (
              <p className="text-gray-500">ยังไม่มีเมนู</p>
            ) : (
              <ul className="space-y-4">
                {recipes.map((r) => (
                  <li key={r.id} className="border-b pb-3 flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{r.title}</p>
                      <p className="text-sm text-gray-500">
                        เวลาทำ: {r.cookTime} นาที | แคลอรี่: {r.calories} | ความยาก: {r.difficulty}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(r)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        ลบ
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {showEditPanel && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white max-w-3xl w-full p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-semibold mb-4">
                  {isEditing ? 'แก้ไขเมนูอาหาร' : 'เพิ่มเมนูอาหาร'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input name="title" placeholder="ชื่อเมนู" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
                  <input name="imageUrl" placeholder="ลิงก์รูปภาพ" value={formData.imageUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
                  <input name="cookTime" type="number" placeholder="เวลาทำ (นาที)" value={formData.cookTime} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
                  <input name="calories" type="number" placeholder="แคลอรี่รวม" value={formData.calories} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
                  <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full px-4 py-2 border rounded">
                    <option value="easy">ง่าย</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="hard">ยาก</option>
                  </select>
                  <input name="diet_type" placeholder="ประเภทอาหาร" value={formData.diet_type} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
                  <input name="videoUrl" placeholder="ลิงก์วิดีโอ" value={formData.videoUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

                  <div>
                    <h3 className="font-bold mt-4 mb-2">วัตถุดิบ</h3>
                    {formData.ingredients.map((ing, index) => (
                      <div key={index} className="grid grid-cols-6 gap-2 mb-2 items-center">
                        <input value={ing.name} onChange={(e) => updateIngredient(index, 'name', e.target.value)} className="col-span-2 px-2 py-1 border rounded" placeholder="ชื่อวัตถุดิบ" />
                        <input value={ing.nutrition} onChange={(e) => updateIngredient(index, 'nutrition', e.target.value)} className="px-2 py-1 border rounded" placeholder="สารอาหาร" />
                        <input type="number" value={ing.caloriesPerUnit} onChange={(e) => updateIngredient(index, 'caloriesPerUnit', +e.target.value)} className="px-2 py-1 border rounded" placeholder="แคลอรี่/หน่วย" />
                        <input value={ing.unit} onChange={(e) => updateIngredient(index, 'unit', e.target.value)} className="px-2 py-1 border rounded" placeholder="หน่วย" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.ingredients.filter((_, i) => i !== index);
                            setFormData({ ...formData, ingredients: updated });
                          }}
                          className="text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all px-2 py-1 rounded"
                        >
                          ลบ
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          ingredients: [
                            ...formData.ingredients,
                            {
                              id: uuidv4(),
                              name: '',
                              nutrition: '',
                              caloriesPerUnit: 0,
                              unit: '',
                              quantity: 0,
                            },
                          ],
                        })
                      }
                      className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      ➕ เพิ่มวัตถุดิบ
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold mt-4 mb-2">ขั้นตอนการทำ</h3>
                    {formData.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2 mb-2">
                        <textarea
                          value={step}
                          onChange={(e) => updateStep(index, e.target.value)}
                          className="w-full border rounded px-3 py-2"
                          placeholder={`ขั้นตอนที่ ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.steps.filter((_, i) => i !== index);
                            setFormData({ ...formData, steps: updated });
                          }}
                          className="h-fit text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all px-2 py-1 rounded"
                        >
                          ลบ
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, steps: [...formData.steps, ''] })
                      }
                      className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      ➕ เพิ่มขั้นตอน
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setShowEditPanel(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">ยกเลิก</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                      {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminManageRecipesPage;