import { create } from 'zustand';

export interface Ingredient {
  id: string;
  name: string;
  nutrition: string;
  caloriesPerUnit: number;
  unit: string;
  quantity: number | string;
}

export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  ingredients: Ingredient[];
  steps: string[];
  videoUrl?: string;
  diet_type?: string;
}

interface RecipeState {
  recipes: Recipe[];
  favoriteRecipes: string[];
  searchResults: Recipe[];
  popularRecipes: Recipe[];

  searchRecipes: (query: string, filters?: string[]) => void;
  toggleFavorite: (recipeId: string) => void;
  getRandomRecipe: () => Recipe | null;
  getRecipeById: (id: string) => Recipe | null;

  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (updated: Recipe) => void;
  deleteRecipe: (id: string) => void;
}

// ===== Helper =====
function parseQuantity(qty: number | string): number {
  if (typeof qty === 'number') return qty;
  if (qty.includes('-')) {
    const [min, max] = qty.split('-').map(Number);
    return (min + max) / 2;
  }
  if (qty.includes('/')) {
    const [num, denom] = qty.split('/').map(Number);
    return num / denom;
  }
  return parseFloat(qty);
}

function calculateTotalCalories(ingredients: Ingredient[]): number {
  return ingredients.reduce((sum, ing) => {
    const qty = parseQuantity(ing.quantity);
    return sum + qty * ing.caloriesPerUnit;
  }, 0);
}

// ===== LocalStorage Integration =====
const LOCAL_STORAGE_KEY = 'mee-recipes';

function loadRecipes(): Recipe[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockRecipes;
    }
  }
  return mockRecipes;
}

function saveRecipes(recipes: Recipe[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
}

// Mock data from Excel
const mockRecipes: Recipe[] = 
 [
  {
    "id": "1",
    "title": "แกงเขียวหวานไก่",
    "imageUrl": "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2022/09/16/f083c309eaab40b8b21efa7eaeda4b87_How_To_Make_Thai_Green_Curry_Like_A_MICHELIN_Starred_Restaurant2.jpg",
    "cookTime": 60,
    "difficulty": "medium",
    "calories": 644,
    "ingredients": [
  {
    "id": "1",
    "name": "เนื้อไก่ หั่นชิ้น",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "2",
    "name": "กะทิ",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 230.0,
    "unit": "มล.",
    "quantity": "100"
  },
  {
    "id": "3",
    "name": "พริกแกงเขียวหวาน",
    "nutrition": "รวม",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2.5"
  },
  {
    "id": "4",
    "name": "ใบมะกรูดฉีก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.2,
    "unit": "ใบ",
    "quantity": "4.5"
  },
  {
    "id": "5",
    "name": "โหระพา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 22.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "6",
    "name": "มะเขือเปราะหั่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "ลูก",
    "quantity": "2"
  },
  {
    "id": "7",
    "name": "มะเขือพวง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 35.0,
    "unit": "ถ้วย",
    "quantity": "0.5"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 45.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "รวม",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "10",
    "name": "น้ำมะขามเปียก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "11",
    "name": "พริกชี้ฟ้าหั่นเส้น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 9.0,
    "unit": "เม็ด",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "ใส่กะทิลงในหม้อ ตั้งไฟกลาง รอจนกะทิเริ่มแตกมัน",
      "ใส่พริกแกงเขียวหวานลงไปผัดในกะทิจนหอม",
      "เติมเนื้อไก่หรือหมูลงไปในหม้อ ผัดจนเนื้อสุก",
      "ใส่มะเขือเปราะ มะเขือพวง และใบมะกรูด ผัดเบาๆ ให้เข้ากัน",
      "เติมน้ำปลากับน้ำตาลปี๊บ ผสมให้เข้ากัน และปรุงรสตามชอบ"
    ],
    "videoUrl": "https://youtu.be/eeGIrnqV7J8?si=EBy20bU2OA08zteX",
    "diet_type": "ฮาลาล"
  },
  {
    "id": "9",
    "title": "ก๋วยเตี๋ยวคั่วไก่",
    "imageUrl": "https://www.unileverfoodsolutions.co.th/dam/global-ufs/mcos/SEA/calcmenu/recipes/TH-recipes/chicken-&-other-poultry-dishes/%E0%B8%81%E0%B9%8B%E0%B8%A7%E0%B8%A2%E0%B9%80%E0%B8%95%E0%B8%B5%E0%B9%8B%E0%B8%A2%E0%B8%A7%E0%B8%84%E0%B8%B1%E0%B9%88%E0%B8%A7%E0%B9%84%E0%B8%81%E0%B9%88/%E0%B8%81%E0%B9%8B%E0%B8%A7%E0%B8%A2%E0%B9%80%E0%B8%95%E0%B8%B5%E0%B9%8B%E0%B8%A2%E0%B8%A7%E0%B8%84%E0%B8%B1%E0%B9%88%E0%B8%A7%E0%B9%84%E0%B8%81%E0%B9%88_header.jpg",
    "cookTime": 15,
    "difficulty": "medium",
    "calories": 959,
    "ingredients": [
  {
    "id": "12",
    "name": "เส้นก๋วยเตี๋ยวแบน",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 108.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "13",
    "name": "เนื้อไก่ (สันในหรือสะโพก)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "14",
    "name": "กระเทียม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "กลีบ",
    "quantity": "3"
  },
  {
    "id": "15",
    "name": "หอมใหญ่ (หั่นบาง)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 45.0,
    "unit": "หัว",
    "quantity": "1"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "17",
    "name": "ซอสปรุงรส",
    "nutrition": "รวม",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "18",
    "name": "น้ำมันหอย",
    "nutrition": "รวม",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "19",
    "name": "ซีอิ๊วดำ",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "20",
    "name": "พริกขี้หนู (หั่นละเอียด ตามความชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "เม็ด",
    "quantity": "7"
  },
  {
    "id": "21",
    "name": "กะเพรา (หั่นหยาบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 22.0,
    "unit": "ถ้วย",
    "quantity": "0.25"
  },
  {
    "id": "22",
    "name": "ถั่วงอก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 31.0,
    "unit": "ถ้วย",
    "quantity": "0.25"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "24",
    "name": "ผักชีฝรั่ง (หั่นฝอย) (ตกแต่ง)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "ถ้วย",
    "quantity": "0.25"
  }
]
,
    "steps": [
      "หั่นเนื้อไก่เป็นชิ้นเล็กๆ หรือขนาดตามชอบ",
      "ล้างเส้นก๋วยเตี๋ยวให้สะอาด และตั้งน้ำให้เดือด จากนั้นลวกเส้นก๋วยเตี๋ยวให้พอสุก ใช้เวลาประมาณ 2-3 นาที แล้วสะเด็ดน้ำ",
      "ตั้งกระทะใส่น้ำมันพืช ใส่กระเทียมและหอมใหญ่ลงไปผัดจนหอม",
      "ใส่เนื้อไก่ลงไปผัดจนสุกและเป็นสีทอง",
      "ใส่เส้นก๋วยเตี๋ยวที่ลวกไว้ลงไปในกระทะ"
    ],
    "videoUrl": "https://youtu.be/iyzVlqpbR_I?si=0191tU6bxj8rGIk-",
    "diet_type": "ฮาลาล"
  },
  {
    "id": "18",
    "title": "กะเพราไก่ไข่ดาว",
    "imageUrl": "https://fit-d.com/uploads/food/afb2ccb7050c6a64d52b7e3736d3a6f8.jpg",
    "cookTime": 25,
    "difficulty": "medium",
    "calories": 1071,
    "ingredients": [
  {
    "id": "25",
    "name": "เนื้อไก่สับ",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "300"
  },
  {
    "id": "26",
    "name": "ใบกะเพราหั่นหยาบ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 22.0,
    "unit": "ถ้วย",
    "quantity": "0.5"
  },
  {
    "id": "27",
    "name": "พริกขี้หนูสด (ตามชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "เม็ด",
    "quantity": "7"
  },
  {
    "id": "14",
    "name": "กระเทียม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "กลีบ",
    "quantity": "3.5"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "รวม",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "28",
    "name": "ซอสถั่วเหลือง",
    "nutrition": "คาร์โบไฮเดรตและโปรตีน",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "0.5"
  },
  {
    "id": "29",
    "name": "น้ำตาล",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "30",
    "name": "ไข่ไก่ (ทอดกรอบ)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 95.0,
    "unit": "ฟอง",
    "quantity": "2"
  },
  {
    "id": "31",
    "name": "ข้าวสวย (หุงสุกแล้ว)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 200.0,
    "unit": "ถ้วย",
    "quantity": "1"
  }
]
,
    "steps": [
      "โขลกพริกขี้หนูและกระเทียมเข้าด้วยกันจนละเอียด",
      "ตั้งกระทะใส่น้ำมันพืชลงไป รอให้น้ำมันร้อนแล้วใส่พริกกระเทียมที่โขลกไว้ลงไปผัดจนหอม",
      "ปรุงรสด้วยน้ำปลา, ซอสถั่วเหลือง, และน้ำตาล ผัดให้เข้ากัน",
      "ใส่ใบกะเพราลงไปผัดจนกะเพราสุกและหอม",
      "ในกระทะอีกใบ ตั้งน้ำมันและทอดไข่ดาวให้ขอบกรอบ ตอกไข่ลงไปแล้วทอดจนไข่ขาวสุกดี แต่ไข่แดงยังคงเหลว"
    ],
    "videoUrl": "https://youtu.be/Sl-yuskaGpY?si=KknDRkrvNLVkMzOv",
    "diet_type": "ฮาลาล"
  },
  {
    "id": "23",
    "title": "แกงมัสมั่นเนื้อ ",
    "imageUrl": "https://www.khaosod.co.th/wpapp/uploads/2021/08/p09130864p1.jpg",
    "cookTime": 60,
    "difficulty": "hard",
    "calories": 650,
    "ingredients": [
  {
    "id": "32",
    "name": "เนื้อวัว (ส่วนสะโพกหรือสันใน)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 250.0,
    "unit": "กรัม",
    "quantity": "500"
  },
  {
    "id": "33",
    "name": "หัวหอมใหญ่ (หั่นบาง)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 45.0,
    "unit": "หัว",
    "quantity": "1"
  },
  {
    "id": "34",
    "name": "มันฝรั่ง (หั่นชิ้นพอดีคำ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 110.0,
    "unit": "หัว",
    "quantity": "2"
  },
  {
    "id": "35",
    "name": "พริกแห้ง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "เม็ด",
    "quantity": "4.5"
  },
  {
    "id": "36",
    "name": "ตะไคร้(ทุบพอแตก)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ต้น",
    "quantity": "1"
  },
  {
    "id": "37",
    "name": "ข่าหั่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "38",
    "name": "รากผักชี (ทุบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "ราก",
    "quantity": "2"
  },
  {
    "id": "14",
    "name": "กระเทียม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "กลีบ",
    "quantity": "4"
  },
  {
    "id": "39",
    "name": "ผิวมะกรูดหั่นฝอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 1.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "2",
    "name": "กะทิ",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 230.0,
    "unit": "มล.",
    "quantity": "400"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "รวม",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 45.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "10",
    "name": "น้ำมะขามเปียก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "40",
    "name": "เกลือ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "41",
    "name": "น้ำซุปหรือน้ำเปล่า",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "มล.",
    "quantity": "500"
  },
  {
    "id": "42",
    "name": "เมล็ดการะเกด",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "43",
    "name": "พริกไทยดำ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "44",
    "name": "น้ำมันพืช (สำหรับผัดเครื่องแกง)",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "45",
    "name": "ผักชีสำหรับโรยหน้า",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 1.0,
    "unit": "ถ้วย",
    "quantity": "1"
  }
]
,
    "steps": [
      "ตักข้าวสวยใส่จาน แล้วตักข้าวกะเพราไก่ใส่ข้างบน วางไข่ดาวทอดลงไปด้านบน",
      "นำพริกแห้ง, ตะไคร้, ข่า, รากผักชี, กระเทียม และผิวมะกรูดไปปั่นหรือโขลกให้ละเอียด",
      "ใส่น้ำมันพืชลงในกระทะร้อน ใช้ไฟปานกลาง ผัดเครื่องแกงจนหอม",
      "ใส่เนื้อวัวลงไปผัดให้พอสุก จากนั้นใส่มันฝรั่ง และกะทิลงไปในหม้อ",
      "เติมน้ำซุปหรือน้ำเปล่าให้พอท่วมเนื้อ"
    ],
    "videoUrl": "https://youtu.be/ypApJ0Aq1qA?si=hhdCYbqRRfvmW8OJ",
    "diet_type": "ฮาลาล"
  },
  {
    "id": "30",
    "title": "ขนมจีนน้ำยา",
    "imageUrl": "https://img.kapook.com/u/2023/wanwanat/1532000339.jpg",
    "cookTime": 40,
    "difficulty": "medium",
    "calories": 1231,
    "ingredients":[
  {
    "id": "2",
    "name": "กะทิ",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 230.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "46",
    "name": "น้ำซุปไก่หรือน้ำเปล่า",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "47",
    "name": "พริกแกง (พริกแกงขนมจีนน้ำยา)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "48",
    "name": "หมูสับ หรือ กุ้งสับ",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "49",
    "name": "ปูม้า (ถ้ามี) หรือปูไข่",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 97.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "50",
    "name": "ใบมะกรูด(ฉีก)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.2,
    "unit": "ใบ",
    "quantity": "2.5"
  },
  {
    "id": "51",
    "name": "ข่า (หั่นแว่น)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ชิ้น",
    "quantity": "0.5"
  },
  {
    "id": "52",
    "name": "ตะไคร้ (หั่นท่อน)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ต้น",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "รวม",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "0.5"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 45.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "53",
    "name": "เกลือ เล็กน้อย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "54",
    "name": "เส้นขนมจีน (สามารถหาซื้อสำเร็จได้)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 120.0,
    "unit": "ถ้วย",
    "quantity": "1"
  }
]
 ,
    "steps": [
      "ตั้งหม้อใส่กะทิและน้ำซุป (หรือเปล่า) ต้มให้เดือด",
      "ใส่พริกแกงลงไปแล้วคนให้เข้ากัน",
      "เติมหมูสับหรือกุ้งสับลงไป คนให้เข้ากันจนเนื้อสุก",
      "ใส่ปูม้า (ถ้ามี) ใบมะกรูด ข่า ตะไคร้ น้ำปลา น้ำตาลปี๊บ และเกลือ",
      "เคี่ยวจนเดือดและส่วนผสมรวมตัวกันจนเข้มข้น ถ้าต้องการข้นกว่านี้สามารถเติมแป้งข้าวโพดละลายน้ำได้"
    ],
    "videoUrl": "https://youtu.be/5FCixbGWdFU?si=2L6-HJHTHUFFYCpq",
    "diet_type": "ฮาลาล"
  },
  {
    "id": "38",
    "title": "ข้าวซอยไก่",
    "imageUrl": "https://i.ytimg.com/vi/vP2Lr1wDE08/sddefault.jpg",
    "cookTime": 60,
    "difficulty": "easy",
    "calories": 1898,
    "ingredients":[
  {
    "id": "55",
    "name": "น่องไก่",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 165.0,
    "unit": "ชิ้น",
    "quantity": "2.5"
  },
  {
    "id": "56",
    "name": "หอมแดง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 12.0,
    "unit": "หัว",
    "quantity": "2"
  },
  {
    "id": "14",
    "name": "กระเทียม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "กลีบ",
    "quantity": "4"
  },
  {
    "id": "57",
    "name": "ตะไคร้",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ต้น",
    "quantity": "1"
  },
  {
    "id": "58",
    "name": "ผงขมิ้น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 8.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "59",
    "name": "ผงกะหรี่",
    "nutrition": "โปรตีน คาร์โบไฮเดรต ไขมัน",
    "caloriesPerUnit": 8.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "รวม",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 45.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "2",
    "name": "กะทิ",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 230.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "60",
    "name": "น้ำซุป",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "2"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1.5"
  },
  {
    "id": "40",
    "name": "เกลือ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "61",
    "name": "เส้นข้าวซอย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 280.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "62",
    "name": "หอมแดงซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 12.0,
    "unit": "หัว",
    "quantity": "2"
  },
  {
    "id": "63",
    "name": "ผักกาดดองหั่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "64",
    "name": "พริกป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "65",
    "name": "มะนาวหั่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "ซีก",
    "quantity": "1"
  },
  {
    "id": "66",
    "name": "ต้นหอมซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 1.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "0.5"
  },
  {
    "id": "67",
    "name": "ข่าหั่นแว่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ชิ้น",
    "quantity": "2.5"
  },
  {
    "id": "68",
    "name": "พริกชี้ฟ้า",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "เม็ด",
    "quantity": "2.5"
  },
  {
    "id": "69",
    "name": "น้ำมันพืช (สำหรับทอดเส้นข้าวซอย)",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "200"
  }
]
 ,
    "steps": [
      "โขลกหอมแดง กระเทียม ข่า ตะไคร้ และพริกชี้ฟ้ารวมกันให้ละเอียด",
      "ตั้งกระทะใส่น้ำมันพืชแล้วผัดเครื่องแกงให้หอม (ผสมผงขมิ้นและผงกะหรี่)",
      "ใส่ไก่ลงไปผัดกับเครื่องแกงจนสุกแล้วเติมน้ำซุป (หรือน้ำเปล่า) และน้ำตาลปี๊บ",
      "ใส่กะทิลงไปต้มจนเดือด เคี่ยวให้ไก่นุ่ม และปรุงรสด้วยน้ำปลา",
      "เมื่อไก่สุกและน้ำซอสข้นแล้ว ตักไก่และน้ำข้าวซอยใส่ภาชนะ   ตั้งกระทะใส่น้ำมันพืช ทอดเส้นข้าวซอยจนกรอบแล้วพักให้สะเด็ดน้ำมัน   วางเส้นข้าวซอยในจาน ราดด้วยน้ำข้าวซอยที่เตรียมไว้"
    ],
    "videoUrl": "https://youtu.be/JgE_eitMndU?si=NwK3McspxPoPFuLI",
    "diet_type": "ฮาลาล"
  },
  {
    "id": "45",
    "title": "ข้าวมันไก่",
    "imageUrl": "https://static.thairath.co.th/media/dFQROr7oWzulq5Fa5naLwWtYtNesZaki91wtz8N9CQg7YZvxZMhzjwoOWiUn6p2zikv.jpg",
    "cookTime": 50,
    "difficulty": "easy",
    "calories": 2600,
    "ingredients": [
  {
    "id": "70",
    "name": "เนื้ออกไก่หรือไก่ทั้งตัว",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "650"
  },
  {
    "id": "71",
    "name": "รากผักชี",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "ราก",
    "quantity": "2.5"
  },
  {
    "id": "72",
    "name": "กระเทียมบุบ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "กลีบ",
    "quantity": "4.5"
  },
  {
    "id": "73",
    "name": "พริกไทยเม็ด",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "40",
    "name": "เกลือ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ลิตร",
    "quantity": "1.5"
  },
  {
    "id": "75",
    "name": "ข้าวหอมมะลิ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 680.0,
    "unit": "ถ้วย",
    "quantity": "2"
  },
  {
    "id": "76",
    "name": "น้ำต้มไก่ (จากข้อ 1)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "2"
  },
  {
    "id": "77",
    "name": "กระเทียมสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "78",
    "name": "ขิงแก่ฝานบาง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "แว่น",
    "quantity": "5.5"
  },
  {
    "id": "79",
    "name": "น้ำมันไก่หรือน้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "80",
    "name": "เกลือเล็กน้อย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "81",
    "name": "เต้าเจี้ยว",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "82",
    "name": "ขิงแก่สับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "83",
    "name": "พริกขี้หนูแดงสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "85",
    "name": "ซีอิ๊วดำหวาน",
    "nutrition": "รวม",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "86",
    "name": "น้ำต้มสุกหรือน้ำซุป",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "ตั้งหม้อน้ำ ใส่รากผักชี กระเทียม พริกไทย เกลือ",
      "เมื่อน้ำเดือด ใส่ไก่ลงต้มจนสุก (ประมาณ 30-40 นาที)",
      "ตักไก่ขึ้น แช่น้ำเย็นแล้วพักไว้ให้สะเด็ดน้ำ             ",
      "เจียวกระเทียมและขิงในน้ำมันให้หอม",
      "ใส่ข้าวสารลงผัดเล็กน้อย แล้วใส่ในหม้อหุงข้าว"
    ],
    "videoUrl": "https://youtu.be/YgmYqZWW4V8?si=BD0JbN-ieMQS7w_r",
    "diet_type": "ฮาลาล"
  },
  {
    "id": "55",
    "title": "ต้มข่าไก่",
    "imageUrl": "https://s359.kapook.com/r/600/auto/pagebuilder/f103aacb-cbd7-4e82-9e73-c134b2551aef.jpg",
    "cookTime": 60,
    "difficulty": "easy",
    "calories": 812,
    "ingredients": [
  {
    "id": "87",
    "name": "เนื้อไก่ (สะโพก หรือ อก) (หั่นเป็นชิ้นพอดีคำ)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "300"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "มล.",
    "quantity": "750"
  },
  {
    "id": "67",
    "name": "ข่าหั่นแว่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "แง่ง",
    "quantity": "3.5"
  },
  {
    "id": "88",
    "name": "ตะไคร้หั่นท่อน",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ต้น",
    "quantity": "2.5"
  },
  {
    "id": "89",
    "name": "ใบมะกรูด",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.2,
    "unit": "ใบ",
    "quantity": "4.5"
  },
  {
    "id": "90",
    "name": "เห็ดฟาง (หั่นเป็นชิ้น)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 30.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "91",
    "name": "พริกขี้หนู (ทุบพอแตก)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "เม็ด",
    "quantity": "6"
  },
  {
    "id": "92",
    "name": "น้ำปลา (ปรับรสชาติ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2.5"
  },
  {
    "id": "93",
    "name": "น้ำมะนาว (ปรับตามความชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "94",
    "name": "นมข้นหวาน (เพิ่มความกลมกล่อม)",
    "nutrition": "คาร์โบไฮเดรต,ไขมัน",
    "caloriesPerUnit": 60.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "3.5"
  },
  {
    "id": "95",
    "name": "น้ำตาลทราย (optional)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "เริ่มต้นโดยการต้มน้ำในหม้อจนเดือด",
      "ใส่ข่าหั่นแว่น ตะไคร้หั่นท่อน และใบมะกรูดลงไปในน้ำเดือด ต้มให้หอม",
      "ใส่เนื้อไก่ที่หั่นเป็นชิ้นแล้วลงไปต้มจนไก่สุก",
      "ใส่เห็ดฟางและพริกขี้หนูลงไป ต้มจนเห็ดนุ่ม",
      "ปรุงรสด้วยน้ำปลา น้ำมะนาว และน้ำตาลทราย (ถ้าชอบ)"
    ],
    "videoUrl": "https://youtu.be/KC-9J7BTHng?si=RHSwuWjN6BgFAUJL",
    "diet_type": "ฮาลาล"
  },
  {
    "id": "63",
    "title": "ต้มยำกุ้ง",
    "imageUrl": "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/04/24/5608757681874e1ea5df1aa41d5b2e3d_How_To_Make_Tom_Yam_Kung_The_Epitome_Of_Delicious_And_Nutritious_Thai_Cuisine3.jpg",
    "cookTime": 40,
    "difficulty": "easy",
    "calories": 462,
    "ingredients": [
  {
    "id": "96",
    "name": "กุ้งสด (ล้างสะอาดและปอกเปลือกไว้)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 99.0,
    "unit": "กรัม",
    "quantity": "300"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "3.5"
  },
  {
    "id": "67",
    "name": "ข่าหั่นแว่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "แง่ง",
    "quantity": "3.5"
  },
  {
    "id": "88",
    "name": "ตะไคร้หั่นท่อน",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ต้น",
    "quantity": "2.5"
  },
  {
    "id": "97",
    "name": "ใบมะกรูด (ฉีกใบออก)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.2,
    "unit": "ใบ",
    "quantity": "4.5"
  },
  {
    "id": "91",
    "name": "พริกขี้หนู (ทุบพอแตก)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "เม็ด",
    "quantity": "7"
  },
  {
    "id": "92",
    "name": "น้ำปลา (ปรับรสชาติ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2.5"
  },
  {
    "id": "98",
    "name": "น้ำมะนาว (ปรับตามความชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "3"
  },
  {
    "id": "99",
    "name": "เห็ดฟาง (หั่นเป็นชิ้น)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 30.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "100",
    "name": "นมข้นหวาน (optional สำหรับรสชาติที่นุ่มนวล)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 60.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "95",
    "name": "น้ำตาลทราย (optional)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "เริ่มต้นโดยการต้มน้ำในหม้อจนเดือด",
      "ใส่ข่าหั่นแว่น ตะไคร้หั่นท่อน และใบมะกรูดลงไปในหม้อ",
      "เมื่อส่วนผสมเริ่มมีกลิ่นหอม ใส่กุ้งและเห็ดฟางลงไป ต้มจนกุ้งสุก",
      "ปรุงรสด้วยน้ำปลา พริกขี้หนูทุบ น้ำมะนาว และน้ำตาลทราย (ถ้าชอบ)",
      "ต้มจนเดือดอีกครั้ง จากนั้นชิมรสชาติ และปรับรสให้ถูกปาก"
    ],
    "videoUrl": "https://youtu.be/Tz7jH-XijB4?si=gYg2hH3sooarS421",
    "diet_type": "ฮาลาล"
  },
  {
    "id": "70",
    "title": "น้ำตกเนื้อ",
    "imageUrl": "https://s359.kapook.com/pagebuilder/3eb49473-76ec-4760-aaa9-0a5894bd5a95.jpg",
    "cookTime": 25,
    "difficulty": "easy",
    "calories": 996,
    "ingredients":[
  {
    "id": "101",
    "name": "เนื้อวัวส่วนติดมัน (เช่น สันคอเนื้อ หรือเนื้อริบอาย)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 294.0,
    "unit": "กรัม",
    "quantity": "300"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "102",
    "name": "ข้าวคั่ว",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 25.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "64",
    "name": "พริกป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "62",
    "name": "หอมแดงซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 12.0,
    "unit": "หัว",
    "quantity": "3"
  },
  {
    "id": "103",
    "name": "ต้นหอม/ผักชีฝรั่งซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ต้น",
    "quantity": "1"
  },
  {
    "id": "104",
    "name": "ใบสะระแหน่ ตามชอบ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ใบ",
    "quantity": "1"
  },
  {
    "id": "105",
    "name": "น้ำตาลทราย (ใส่หรือไม่ใส่ก็ได้)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 2.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "ย่างเนื้อ: ย่างเนื้อวัวบนกระทะหรือเตาถ่านด้วยไฟกลางจนสุกปานกลาง (medium) เพื่อให้เนื้อยังนุ่ม หั่นเป็นชิ้นบางขนาดพอดีคำ",
      "ทำน้ำปรุง: ผสมน้ำปลา น้ำมะนาว น้ำตาลทราย พริกป่น ข้าวคั่ว คนให้เข้ากันในชามผสม",
      "คลุกน้ำตก: ใส่เนื้อย่างหั่นลงไป คลุกให้เข้ากัน จากนั้นใส่หอมแดงซอย ต้นหอม ผักชีฝรั่ง และใบสะระแหน่ คลุกเบา ๆ อีกครั้ง",
      "เสิร์ฟ: จัดใส่จาน เสิร์ฟพร้อมข้าวเหนียวและผักสดตามชอบ",
      "ตั้งหม้อใส่น้ำซุปไก่หรือใช้น้ำเปล่า รอจนเดือด"
    ],
    "videoUrl": "https://youtu.be/Jy4rI8VyLvE?si=FaUqDePA75V4MnoU",
    "diet_type": "ฮาลาล"
  },
  {
    "id": "74",
    "title": "ซุปหน่อไม้",
    "imageUrl": "https://i.ytimg.com/vi/x1iFAbXOSk0/maxresdefault.jpg",
    "cookTime": 30,
    "difficulty": "easy",
    "calories": 370,
    "ingredients": [
  {
    "id": "106",
    "name": "หน่อไม้สดหรือหน่อไม้ดอง (หั่นเป็นชิ้นพอดีคำ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "107",
    "name": "หมูสับ (หรือจะใช้เนื้อสัตว์อื่นตามชอบ)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 27.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "108",
    "name": "น้ำซุปไก่ (หรือใช้น้ำเปล่าแทน)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 242.0,
    "unit": "ถ้วย",
    "quantity": "4"
  },
  {
    "id": "109",
    "name": "กระเทียม (ทุบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "กลีบ",
    "quantity": "3"
  },
  {
    "id": "110",
    "name": "หอมแดง (ทุบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 12.0,
    "unit": "หัว",
    "quantity": "2"
  },
  {
    "id": "111",
    "name": "พริกไทยป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "112",
    "name": "น้ำปลา (ปรับตามรสชาติ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "0.5"
  },
  {
    "id": "113",
    "name": "มะนาว (หรือตามชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 12.0,
    "unit": "ลูก",
    "quantity": "1"
  },
  {
    "id": "4",
    "name": "ใบมะกรูดฉีก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.2,
    "unit": "ใบ",
    "quantity": "2"
  },
  {
    "id": "114",
    "name": "ข่า (หั่นแว่น) (ถ้าใช้หน่อไม้สด)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ชิ้น",
    "quantity": "2.5"
  },
  {
    "id": "115",
    "name": "ผักชี (โรยหน้า)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 1.0,
    "unit": "ใบ",
    "quantity": "1"
  }
]
,
    "steps": [
      "ตั้งหม้อใส่น้ำซุปไก่หรือใช้น้ำเปล่า รอจนเดือด",
      "ใส่กระเทียม ทุบหอมแดง และข่าลงไปในหม้อ แล้วเคี่ยวให้หอม",
      "ใส่หน่อไม้สดหรือหน่อไม้ดองลงไป (ถ้าใช้หน่อไม้ดองให้ล้างน้ำก่อนเพื่อลดความเค็ม) เคี่ยวไปอีก 5-10 นาที",
      "ใส่หมูสับลงไป ปรุงรสด้วยน้ำปลา และพริกไทยป่น ชิมรสตามชอบ",
      "ใส่ใบมะกรูดฉีกและมะนาวลงไปเพื่อเพิ่มความหอมและเปรี้ยว เคี่ยวจนหมูสุก และรสชาติกลมกล่อม"
    ],
    "videoUrl": "https://youtu.be/_JI5aSvxMHo?si=2OpW5Qr-biLPpPj_",
    "diet_type": "อาหารเจ"
  },
  {
    "id": "80",
    "title": "บวบผัดไข่",
    "imageUrl": "https://i.ytimg.com/vi/El3ZP5uzHhk/maxresdefault.jpg",
    "cookTime": 20,
    "difficulty": "easy",
    "calories": 427,
    "ingredients": [
  {
    "id": "116",
    "name": "บวบ (หั่นเป็นแว่น)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 19.0,
    "unit": "ลูก",
    "quantity": "2"
  },
  {
    "id": "117",
    "name": "ไข่ไก่",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 75.0,
    "unit": "ฟอง",
    "quantity": "2"
  },
  {
    "id": "77",
    "name": "กระเทียมสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1.5"
  },
  {
    "id": "17",
    "name": "ซอสปรุงรส",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "29",
    "name": "น้ำตาล",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "111",
    "name": "พริกไทยป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "0.25"
  },
  {
    "id": "118",
    "name": "ผักชีสับ (สำหรับตกแต่ง)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 1.0,
    "unit": "ใบ",
    "quantity": "1"
  }
]
,
    "steps": [
      "เตรียมบวบ: ล้างบวบให้สะอาด จากนั้นหั่นเป็นแว่นๆ หรือเป็นชิ้นตามต้องการ",
      "ตีไข่: ตีไข่ในถ้วยให้แตก (ไม่ต้องปรุงรสไข่ในขั้นตอนนี้)",
      "ผัดกระเทียม: ใส่น้ำมันพืชในกระทะ รอให้น้ำมันร้อนแล้วใส่กระเทียมสับลงไปผัดจนหอม",
      "ผัดบวบ: ใส่บวบที่หั่นแล้วลงไปผัดในกระทะ ผัดให้บวบเริ่มนิ่มและมีสีสันสดใส",
      "ปรุงรส: เติมซอสปรุงรส น้ำตาล และพริกไทยลงไป ผัดให้เข้ากัน"
    ],
    "videoUrl": "https://youtu.be/El3ZP5uzHhk?si=jO02eBkNoBaNajNb",
    "diet_type": "อาหารเจ"
  },
  {
    "id": "87",
    "title": "ฟักทองผัดไข่",
    "imageUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg7Rp3biEQBnqsWwp1-X0pk3OCfwUOFklwdT6UkXfpj1oyuPiycKjEEwZ3KupmitafCVgXQ_oP3ffrYDUQg49xg-t4Y7PwXFwSUrRzhKcKXpzQv10BduYdTMGWZd4An4sy_OAUAJ8Nnkme3/s1600/2017-07-20-18-59-57.jpg",
    "cookTime": 25,
    "difficulty": "easy",
    "calories": 370,
    "ingredients": [
  {
    "id": "119",
    "name": "ฟักทองหั่นชิ้นพอดีคำ",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 26.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "117",
    "name": "ไข่ไก่",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 75.0,
    "unit": "ฟอง",
    "quantity": "2"
  },
  {
    "id": "120",
    "name": "กระเทียมสับหยาบ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "111",
    "name": "พริกไทยป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "122",
    "name": "น้ำมันพืชสำหรับผัด",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "123",
    "name": "ใบโหระพา (ใส่หรือไม่ใส่ก็ได้)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 22.0,
    "unit": "ใบ",
    "quantity": "10"
  }
]
,
    "steps": [
      "ตั้งกระทะบนไฟกลาง ใส่น้ำมันพืช รอให้น้ำมันร้อน ใส่กระเทียมสับลงไปผัดจนหอม",
      "ใส่ฟักทองลงไปผัดให้เข้ากัน เติมน้ำเปล่าลงไป ปิดฝา รอจนฟักทองเริ่มสุก",
      "ปรุงรสด้วยซีอิ๊วขาว น้ำตาลทราย และพริกไทยป่น ผัดให้เข้ากัน",
      "ตอกไข่ลงไป ใช้ตะหลิวคนเบา ๆ ให้ไข่กระจายทั่วกระทะ ผัดจนไข่สุกและเคลือบฟักทอง",
      "ใส่ใบโหระพา ผัดให้เข้ากันอีกครั้ง แล้วปิดไฟ"
    ],
    "videoUrl": "https://youtu.be/-V4zHOOgx2U?si=HR1OF4p4ogfVMcV_",
    "diet_type": "อาหารเจ"
  },
  {
    "id": "93",
    "title": "วุ้นเส้นผัดไข่",
    "imageUrl": "https://i.ytimg.com/vi/KzwKxIN4X0k/maxresdefault.jpg",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 811,
    "ingredients": [
  {
    "id": "124",
    "name": "วุ้นเส้น (แช่น้ำให้นุ่ม)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 330.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "117",
    "name": "ไข่ไก่",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 75.0,
    "unit": "ฟอง",
    "quantity": "2"
  },
  {
    "id": "77",
    "name": "กระเทียมสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "125",
    "name": "ผักต่าง ๆ เช่น แครอทหั่นฝอย, เห็ดหอม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 35.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "126",
    "name": "ซอสหอยนางรม",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "127",
    "name": "พริกไทยป่น (ตามชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "128",
    "name": "ต้นหอม (สำหรับตกแต่ง)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 1.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "เตรียมวุ้นเส้น: แช่วุ้นเส้นในน้ำเย็นจนแช่นุ่ม แล้วสะเด็ดน้ำออก",
      "ทำไข่: ตอกไข่ใส่ถ้วย ผสมกับน้ำตาลทรายเล็กน้อย",
      "ผัดกระเทียม: ตั้งกระทะบนไฟกลาง ใส่น้ำมันพืชและกระเทียมสับลงไป ผัดจนหอม",
      "ผัดไข่: เทไข่ลงไปในกระทะ ผัดให้ไข่สุกและกระจายทั่วกระทะ",
      "ผัดวุ้นเส้น: ใส่วุ้นเส้นที่เตรียมไว้ลงในกระทะ พร้อมซอสหอยนางรม, น้ำปลา และพริกไทย ผัดจนวุ้นเส้นสุกและเคลือบเครื่องปรุง"
    ],
    "videoUrl": "https://youtu.be/qaH5BcI9q-g?si=CO3RsH7YL81BWVOo",
    "diet_type": "อาหารเจ"
  },
  {
    "id": "100",
    "title": "ผัดดอกกะหล่ำหมูสับ",
    "imageUrl": "https://i.ytimg.com/vi/_kAlEcUb7Jw/maxresdefault.jpg",
    "cookTime": 20,
    "difficulty": "easy",
    "calories": 574,
    "ingredients": [
  {
    "id": "129",
    "name": "ดอกกะหล่ำ (หั่นชิ้นพอดีคำ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "หัว",
    "quantity": "0.5"
  },
  {
    "id": "130",
    "name": "หมูสับ",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 242.0,
    "unit": "กรัม",
    "quantity": "150"
  },
  {
    "id": "77",
    "name": "กระเทียมสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "131",
    "name": "พริกไทยป่น (ใส่หรือไม่ใส่ก็ได้)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "0.25"
  },
  {
    "id": "18",
    "name": "น้ำมันหอย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.25"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2.5"
  },
  {
    "id": "122",
    "name": "น้ำมันพืชสำหรับผัด",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "ล้างดอกกะหล่ำให้สะอาด หั่นเป็นชิ้นพอดีคำ แล้วแช่ในน้ำผสมเกลือเล็กน้อยประมาณ 5 นาที จากนั้นล้างออกและสะเด็ดน้ำ",
      "ตั้งกระทะบนไฟกลาง ใส่น้ำมันพืชลงไป รอให้น้ำมันร้อน ใส่กระเทียมสับลงไปผัดจนหอม",
      "ใส่หมูสับลงไปผัดจนสุก",
      "ใส่ดอกกะหล่ำลงไปผัดให้เข้ากัน เติมน้ำเปล่าลงไปเล็กน้อย เพื่อให้ผักสุกนิ่ม",
      "ปรุงรสด้วยน้ำมันหอย ซีอิ๊วขาว และน้ำตาลทราย ผัดให้เข้ากันจนผักสุกและรสชาติเข้ากันดี"
    ],
    "videoUrl": "https://youtu.be/_kAlEcUb7Jw?si=mEgfIBSMQxpqq6Wf",
    "diet_type": "อาหารเจ"
  },
  {
    "id": "106",
    "title": "ผัดผักรวมมิตร",
    "imageUrl": "https://images.aws.nestle.recipes/original/9a335435945f06cc5379513b5f7f6042_artboard_1.jpg",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 345,
    "ingredients": [
  {
    "id": "77",
    "name": "กระเทียมสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "132",
    "name": "บรอกโคลี (หั่นชิ้น)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 35.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "133",
    "name": "ดอกกะหล่ำ (หั่นชิ้น)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "134",
    "name": "เห็ดฟาง (ผ่าครึ่ง)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 30.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "135",
    "name": "ข้าวโพดอ่อน (หั่นเฉียง)",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 26.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "18",
    "name": "น้ำมันหอย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "0.5"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "3"
  }
]
,
    "steps": [
      "ตั้งกระทะบนไฟปานกลาง ใส่น้ำมันพืช รอให้น้ำมันร้อน ใส่กระเทียมสับลงไปผัดจนหอม",
      "ใส่ผักที่เตรียมไว้ลงไปผัดจนเริ่มสุก",
      "ปรุงรสด้วยน้ำมันหอย น้ำตาลทราย ซีอิ๊วขาว และน้ำเปล่า ผัดให้เข้ากัน",
      "ผัดต่อจนผักสุกและรสชาติเข้ากันดี ตักใส่จาน พร้อมเสิร์ฟ",
      "เตรียมหน่อไม้: หากใช้หน่อไม้ดิบ ให้ต้มก่อน 1-2 รอบ เพื่อลดกลิ่นฉุนและความขม แล้วล้างน้ำสะอาด"
    ],
    "videoUrl": "https://youtu.be/7Tpgli65QmY?si=xxJkvWsQf1wp1KaN",
    "diet_type": "อาหารเจ"
  },
  {
    "id": "110",
    "title": "หน่อไม้ผัดไข่",
    "imageUrl": "https://i.ytimg.com/vi/q2_ZXbtvYLg/maxresdefault.jpg",
    "cookTime": 20,
    "difficulty": "easy",
    "calories": 436,
    "ingredients": [
  {
    "id": "136",
    "name": "หน่อไม้ต้มสุก หั่นเส้นหรือซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 27.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "117",
    "name": "ไข่ไก่",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 75.0,
    "unit": "ฟอง",
    "quantity": "2"
  },
  {
    "id": "77",
    "name": "กระเทียมสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "18",
    "name": "น้ำมันหอย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "122",
    "name": "น้ำมันพืชสำหรับผัด",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "เตรียมหน่อไม้: หากใช้หน่อไม้ดิบ ให้ต้มก่อน 1-2 รอบ เพื่อลดกลิ่นฉุนและความขม แล้วล้างน้ำสะอาด",
      "ตั้งกระทะ: ใส่น้ำมันพืชลงกระทะ ใส่กระเทียมสับ ผัดให้หอม",
      "ใส่หน่อไม้: ใส่หน่อไม้ลงผัด ปรุงรสด้วยน้ำมันหอย ซีอิ๊วขาว น้ำตาล ผัดให้เข้ากัน",
      "ใส่ไข่: ตอกไข่ลงไป ใช้ตะหลิวคนให้ไข่กระจายทั่วกับหน่อไม้",
      "ผัดจนสุก: ผัดให้ไข่สุกทั่ว โรยต้นหอมและพริกไทยป่นตามชอบ"
    ],
    "videoUrl": "https://youtu.be/q2_ZXbtvYLg?si=CQTbQVyn_GE34ATf",
    "diet_type": "อาหารเจ"
  },
  {
    "id": "116",
    "title": "น้ำพริกหนุ่ม",
    "imageUrl": "https://images.aws.nestle.recipes/original/c603d386b22d1b84131ab1aeea0f18ce_%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%9E%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%AB%E0%B8%99%E0%B8%B8%E0%B9%88%E0%B8%A1.png",
    "cookTime": 20,
    "difficulty": "easy",
    "calories": 161,
    "ingredients": [
  {
    "id": "137",
    "name": "พริกหนุ่ม (พริกเขียวหยวก)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "เม็ด",
    "quantity": "6"
  },
  {
    "id": "56",
    "name": "หอมแดง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 12.0,
    "unit": "หัว",
    "quantity": "5"
  },
  {
    "id": "138",
    "name": "กระเทียมไทย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "กลีบ",
    "quantity": "10"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "139",
    "name": "น้ำมะนาว (ไม่ใส่ก็ได้ ขึ้นกับความชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 1.3,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "140",
    "name": "น้ำตาลทรายเล็กน้อย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "ย่างพริกและเครื่อง: นำพริกหนุ่ม หอมแดง และกระเทียม ไปย่างบนเตาหรือกระทะจนเปลือกไหม้เล็กน้อย แล้วลอกเปลือกออก (เพื่อให้หอมขึ้น)",
      "โขลกส่วนผสม: โขลกหอมแดง กระเทียม และพริกหนุ่มให้พอหยาบหรือเนียนตามชอบ",
      "ปรุงรส: เติมน้ำปลา น้ำตาล และน้ำมะนาว (หากใช้) โขลกให้เข้ากัน ชิมรสให้ออกเค็มนำ เผ็ดตาม หอมกลิ่นย่าง",
      "จัดเสิร์ฟ: ตักใส่ถ้วย เสิร์ฟพร้อมผักสด แคบหมู หรือไข่ต้ม",
      "ตั้งกระทะ ใส่น้ำมัน ใช้ไฟกลาง ใส่กระเทียมลงผัดจนหอม"
    ],
    "videoUrl": "https://youtu.be/mOtQWnK7iMw?si=QTtFaRcQPfIzBAam",
    "diet_type": "อาหารเจ"
  },
  {
    "id": "120",
    "title": "ถั่วงอกผัดเต้าหู้",
    "imageUrl": "https://s359.kapook.com/pagebuilder/6a4a7419-d41b-4c6f-8d6b-a4adc8ce3471.jpg",
    "cookTime": 10,
    "difficulty": "easy",
    "calories": 342,
    "ingredients": [
  {
    "id": "22",
    "name": "ถั่วงอก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 13.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "141",
    "name": "เต้าหู้ขาวแข็ง (หรือเต้าหู้เหลือง) (หั่นเป็นชิ้นพอดีคำ)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 144.0,
    "unit": "ก้อน",
    "quantity": "1"
  },
  {
    "id": "77",
    "name": "กระเทียมสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "142",
    "name": "ซอสเห็ดหอม",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "ตั้งกระทะ ใส่น้ำมัน ใช้ไฟกลาง ใส่กระเทียมลงผัดจนหอม",
      "ใส่เต้าหู้ลงทอดจนเหลืองนิด ๆ กลับด้านให้เหลืองเท่า ๆ กัน",
      "ใส่ถั่วงอกลงไป ผัดเร็ว ๆ ด้วยไฟแรง",
      "ปรุงรสด้วยซีอิ๊วขาว ซอสเห็ดหอม และน้ำตาล ผัดให้เข้ากันเร็ว ๆ อย่าให้นานเกินไป ถั่วงอกจะนิ่ม",
      "ปิดไฟ โรยต้นหอมซอยและพริกไทย"
    ],
    "videoUrl": "https://youtu.be/O5Eg7TjawXU?si=43FOpAqkhHokgAe4",
    "diet_type": "อาหารเจ"
  },
  {
    "id": "126",
    "title": "ดอกแคผัดไข่",
    "imageUrl": "https://i.ytimg.com/vi/yDNbHwRvlqM/maxresdefault.jpg",
    "cookTime": 10,
    "difficulty": "easy",
    "calories": 441,
    "ingredients": [
  {
    "id": "143",
    "name": "ดอกแค (ล้างสะอาด)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 23.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "117",
    "name": "ไข่ไก่",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 75.0,
    "unit": "ฟอง",
    "quantity": "2"
  },
  {
    "id": "144",
    "name": "กระเทียม (สับละเอียด)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "กลีบ",
    "quantity": "2"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "145",
    "name": "น้ำปลา (หรือปรับตามรสชาติ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 3.3,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "146",
    "name": "ซอสถั่วเหลือง (optional)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "147",
    "name": "พริกไทยป่น (หรือปรับตามรสชาติ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "148",
    "name": "เกลือเล็กน้อย (ปรับตามรสชาติ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "0.25"
  },
  {
    "id": "149",
    "name": "น้ำตาล (optional)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "ล้างดอกแคให้สะอาด โดยเลือกดอกที่ยังสดอยู่ ไม่เหี่ยวหรือแห้ง จากนั้นสะเด็ดน้ำให้แห้ง",
      "ตั้งกระทะบนไฟกลาง ใส่น้ำมันพืชลงไป รอให้น้ำมันร้อน",
      "ใส่กระเทียมสับลงไปผัดจนหอม",
      "จากนั้นใส่ดอกแคลงไปผัดจนเริ่มนิ่ม (ประมาณ 1-2 นาที)",
      "ตีไข่ใส่ชามแล้วปรุงรสด้วยน้ำปลา ซอสถั่วเหลือง และพริกไทย ใส่ไข่ลงไปในกระทะแล้วผัดให้ไข่สุก"
    ],
    "videoUrl": "https://youtu.be/yDNbHwRvlqM?si=gFkkb9DvG9_J--gf",
    "diet_type": "อาหารเจ"
  },
  {
    "id": "133",
    "title": "คั่วกลิ้งหมู",
    "imageUrl": "https://api2.krua.co/wp-content/uploads/2019/11/ImageBannerMobile_960x633_New_-01.jpg",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 791,
    "ingredients": [
  {
    "id": "130",
    "name": "หมูสับ",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 242.0,
    "unit": "กรัม",
    "quantity": "250"
  },
  {
    "id": "150",
    "name": "พริกแกงคั่วกลิ้ง",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 25.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1.5"
  },
  {
    "id": "151",
    "name": "ตะไคร้ซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "152",
    "name": "พริกชี้ฟ้าแดงหั่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "เม็ด",
    "quantity": "1"
  },
  {
    "id": "153",
    "name": "ใบมะกรูดหั่นฝอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 1.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "154",
    "name": "พริกไทยอ่อน",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "155",
    "name": "ผงปรุงรส",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "156",
    "name": "น้ำมันรำข้าว",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "3"
  }
]
,
    "steps": [
      "ตั้งกระทะบนไฟกลาง ใส่น้ำมันรำข้าวลงไป",
      "เมื่อกระทะร้อน ใส่พริกแกงคั่วกลิ้งลงไป ผัดจนมีกลิ่นหอม",
      "ใส่หมูสับลงไป ผัดให้เข้ากับพริกแกง เติมน้ำเปล่าเล็กน้อยเพื่อไม่ให้แห้งเกินไป",
      "ปรุงรสด้วยน้ำปลาและผงปรุงรส ผัดให้เข้ากัน",
      "ใส่พริกไทยอ่อน ตะไคร้ซอย ใบมะกรูดซอย และพริกชี้ฟ้าแดง ผัดให้เข้ากันจนหมูสุกและเครื่องเทศหอม"
    ],
    "videoUrl": "https://youtu.be/dPXJ_99pDfE?si=lewHpMhnxH7yFcbo",
    "diet_type": "คีโต"
  },
  {
    "id": "139",
    "title": "ปลานึ่งมะนาว",
    "imageUrl": "https://img-ha.mthcdn.com/RT3mM9Or3ui1hOATkYSW5i38pDg=/food.mthai.com/app/uploads/2017/02/Spicy-fish.jpg\n\n\n",
    "cookTime": 30,
    "difficulty": "easy",
    "calories": 468,
    "ingredients": [
  {
    "id": "157",
    "name": "ปลา (ปลากะพง, ปลาทับทิม, ปลานิล หรือปลาตามชอบ)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 128.0,
    "unit": "ตัว",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "3.5"
  },
  {
    "id": "29",
    "name": "น้ำตาล",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 16.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "158",
    "name": "พริกขี้หนูสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "77",
    "name": "กระเทียมสับ",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "159",
    "name": "ผักชี",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 1.0,
    "unit": "ต้น",
    "quantity": "1"
  },
  {
    "id": "160",
    "name": "ตะไคร้",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "ต้น",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "เตรียมปลา: ขอดเกล็ดปลา ควักเหงือกและไส้ออก ล้างให้สะอาด จากนั้นบั้งเนื้อปลาทั้งสองด้านเพื่อให้รสชาติเข้าเนื้อ",
      "เตรียมสมุนไพร: ตัดตะไคร้เป็นท่อนสั้น ๆ และทุบพอแตก ใส่ลงไปในท้องปลา",
      "นึ่งปลา: นำปลาใส่จานสำหรับนึ่ง แล้วนำไปนึ่งในหม้อน้ำเดือดด้วยไฟแรง ประมาณ 15–20 นาที หรือจนสุก",
      "ทำน้ำยำ: ผสมน้ำปลา น้ำมะนาว น้ำตาล พริกขี้หนูสับ และกระเทียมสับเข้าด้วยกันในถ้วย คนให้เข้ากันจนกระทั่งน้ำตาลละลาย",
      "ราดน้ำยำ: นำปลาที่นึ่งสุกแล้วมาวางในจาน ราดน้ำยำที่เตรียมไว้ลงไปบนตัวปลา"
    ],
    "videoUrl": "https://youtu.be/3cXmEmOmbog?si=33PX0Ye_lHjuGCAt",
    "diet_type": "คีโต"
  },
  {
    "id": "144",
    "title": "หมูแดดเดียว",
    "imageUrl": "https://www.f1solar.co/wp-content/uploads/2021/04/%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%81%E0%B8%94%E0%B8%94%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B8%A7-2.jpg",
    "cookTime": 250,
    "difficulty": "easy",
    "calories": 500,
    "ingredients": [
  {
    "id": "161",
    "name": "เนื้อหมูสันคอหรือสันใน (หั่นเป็นชิ้นยาวประมาณ 1 ซม.)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 242.0,
    "unit": "กรัม",
    "quantity": "500"
  },
  {
    "id": "77",
    "name": "กระเทียมสับ",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "111",
    "name": "พริกไทยป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 3.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 48.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "126",
    "name": "ซอสหอยนางรม",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 9.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "18",
    "name": "น้ำมันหอย",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 9.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "162",
    "name": "งาขาวคั่ว (ใส่หรือไม่ใส่ก็ได้)",
    "nutrition": "ไขมัน,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 52.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "163",
    "name": "น้ำมันพืชสำหรับทอด",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  }
]
,
    "steps": [
      "ตกแต่งและเสิร์ฟ: แต่งหน้าด้วยมะนาวฝานแว่นและผักชี เสิร์ฟพร้อมข้าวสวยร้อน ๆ",
      "เตรียมหมู: ล้างหมูให้สะอาด ซับให้แห้ง แล้วหั่นเป็นชิ้นยาวประมาณ 1 ซม.",
      "ผสมเครื่องปรุง: ใส่กระเทียมสับ พริกไทยป่น น้ำตาลทราย ซอสหอยนางรม ซีอิ๊วขาว น้ำมันหอย และงาขาวคั่ว (ถ้าใช้) ลงในชามผสม คลุกเคล้าให้เข้ากัน",
      "หมักหมู: ใส่หมูที่เตรียมไว้ลงในชามผสม คลุกเคล้าให้เครื่องปรุงซึมเข้าเนื้อหมู หมักทิ้งไว้ในตู้เย็นประมาณ 2 ชั่วโมง",
      "ตากแดด: นำหมูที่หมักแล้วมาเรียงบนตะแกรง หรือผ้าขาวบาง แล้วนำไปตากแดดจนแห้งหมาด ๆ ประมาณ 4–5 ชั่วโมง (ขึ้นอยู่กับความแรงของแดด)"
    ],
    "videoUrl": "https://example.com/placeholder.mp4",
    "diet_type": "NaN"
  },
  {
    "id": "151",
    "title": "ทอดมันปลากราย",
    "imageUrl": "https://www.kruamoomoo.com/wp-content/uploads/2014/05/thai-spicy-clown-knife-fish-cake-061.jpg\n",
    "cookTime": 30,
    "difficulty": "medium",
    "calories": 695,
    "ingredients": [
  {
    "id": "164",
    "name": "เนื้อปลากรายขูด",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 105.0,
    "unit": "กรัม",
    "quantity": "300"
  },
  {
    "id": "165",
    "name": "พริกแกงเผ็ด",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "117",
    "name": "ไข่ไก่",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 70.0,
    "unit": "ฟอง",
    "quantity": "1"
  },
  {
    "id": "166",
    "name": "ถั่วฝักยาวซอย",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 34.0,
    "unit": "ถ้วย",
    "quantity": "0.5"
  },
  {
    "id": "153",
    "name": "ใบมะกรูดหั่นฝอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 16.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "167",
    "name": "น้ำมันสำหรับทอด",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "168",
    "name": "น้ำส้มสายชู",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.8,
    "unit": "ช้อนโต๊ะ",
    "quantity": "3"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 48.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "80",
    "name": "เกลือเล็กน้อย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "169",
    "name": "แตงกวาหั่นเต๋า, ถั่วลิสงคั่วบด, พริกแดงหั่น และผักชี (สำหรับโรยหน้า)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 1.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "โขลกเนื้อปลากรายกับพริกแกงเผ็ดให้เข้ากัน จนเหนียว",
      "เติมไข่ไก่ น้ำปลา น้ำตาล ถั่วฝักยาว และใบมะกรูด ผสมให้เข้ากันดี",
      "ใช้มือเปียกน้ำปั้นเป็นแผ่นกลม แบนเล็กน้อย",
      "ตั้งน้ำมันให้ร้อน ทอดชิ้นปลาทีละชิ้นจนสุกเหลืองทั่ว ตักพักสะเด็ดน้ำมัน",
      "ทำน้ำจิ้มโดยเคี่ยวน้ำส้มสายชู น้ำตาล และเกลือ ให้ละลาย ปิดไฟ พักให้เย็น"
    ],
    "videoUrl": "https://youtu.be/O7GfJ8QGt_Y?si=MnYAKdH7upsTCzWb",
    "diet_type": "คีโต"
  },
  {
    "id": "157",
    "title": "ปีกไก่ทอดน้ำปลา",
    "imageUrl": "https://i.ytimg.com/vi/60xSNZvr7Ck/maxresdefault.jpg",
    "cookTime": 30,
    "difficulty": "easy",
    "calories": 1334,
    "ingredients": [
  {
    "id": "170",
    "name": "ปีกไก่",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 215.0,
    "unit": "กรัม",
    "quantity": "500"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 16.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "111",
    "name": "พริกไทยป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "171",
    "name": "แป้งทอดกรอบ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 30.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "3.5"
  },
  {
    "id": "172",
    "name": "น้ำเย็นจัด",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1.5"
  },
  {
    "id": "163",
    "name": "น้ำมันพืชสำหรับทอด",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "เตรียมปีกไก่: ล้างปีกไก่ให้สะอาด แล้วใช้ส้อมจิ้มที่หนังไก่และเนื้อไก่ให้ทั่วทั้งสองด้าน เพื่อให้ตอนหมักน้ำปลาซึมเข้าเนื้อได้ง่าย",
      "หมักไก่: ใส่น้ำปลาลงไป คลุกเคล้าไก่กับน้ำปลาให้เข้ากัน บีบๆ นวดๆ ให้น้ำปลาซึมเข้าไปในเนื้อไก่ หมักทิ้งไว้ 30 นาที ถึง 1 ชั่วโมง",
      "เตรียมแป้งชุบทอด: ผสมแป้งทอดกรอบกับน้ำเย็นจัด คนให้เข้ากันจนแป้งละลายเป็นเนื้อเดียว",
      "ชุบแป้ง: นำปีกไก่ที่หมักแล้วไปคลุกเคล้ากับแป้งที่เตรียมไว้ให้ทั่วทั้งชิ้น",
      "ทอดไก่: ตั้งกระทะใส่น้ำมันให้ท่วมไก่ ใช้ไฟกลาง รอจนน้ำมันร้อน ใส่ปีกไก่ที่ชุบแป้งลงไปทอดจนสุกเหลืองกรอบ ตักขึ้นสะเด็ดน้ำมัน"
    ],
    "videoUrl": "https://youtu.be/c7pIuGCADKo?si=5fMnfxRxw9eSlV2b",
    "diet_type": "คีโต"
  },
  {
    "id": "163",
    "title": "กุ้งแช่น้ำปลา",
    "imageUrl": "https://aowtakiabseafood.com/delivery/wp-content/uploads/2019/05/prawn-spicy-sauce.jpg",
    "cookTime": 20,
    "difficulty": "easy",
    "calories": 338,
    "ingredients": [
  {
    "id": "173",
    "name": "กุ้งสด (ขนาดกลาง-ใหญ่)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 85.0,
    "unit": "กรัม",
    "quantity": "300"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "3"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 16.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 4.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "144",
    "name": "กระเทียม (สับละเอียด)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "กลีบ",
    "quantity": "3"
  },
  {
    "id": "174",
    "name": "พริกขี้หนู (หั่นเป็นแว่น) (ตามความชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "เม็ด",
    "quantity": "7"
  },
  {
    "id": "175",
    "name": "ผักชีฝรั่ง (หั่นฝอย)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 2.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  }
]
,
    "steps": [
      "ล้างกุ้งให้สะอาด แล้วผ่าหลังเอาเส้นดำออก จากนั้นนำไปลวกในน้ำเดือดประมาณ 2-3 นาที หรือจนกุ้งสุก จากนั้นนำกุ้งมาพักให้สะเด็ดน้ำ",
      "ใส่น้ำปลา, น้ำตาลทราย, น้ำมะนาวลงในชามผสม คนให้เข้ากันจนละลาย",
      "ใส่กระเทียมสับละเอียดและพริกขี้หนูหั่นลงไปผสมให้เข้ากัน",
      "ใส่กุ้งที่ลวกแล้วลงไปในน้ำปลาที่เตรียมไว้ แช่ทิ้งไว้ประมาณ 10-15 นาที (ถ้าอยากให้รสชาติซึมซาบได้ดีขึ้น อาจแช่ไว้นานกว่านี้)",
      "ตักกุ้งแช่น้ำปลาจัดใส่จาน โรยหน้าด้วยผักชีฝรั่งและใบสะระแหน่ ตกแต่งให้สวยงาม พร้อมทานได้เลย"
    ],
    "videoUrl": "https://youtu.be/9mhdCW-WNyU?si=Bv5js-h9WGGJPVyI",
    "diet_type": "คีโต"
  },
  {
    "id": "168",
    "title": "แจ่วบอง",
    "imageUrl": "https://i.ytimg.com/vi/-DfzdoYSpRs/maxresdefault.jpg",
    "cookTime": 60,
    "difficulty": "easy",
    "calories": 484,
    "ingredients": [
  {
    "id": "176",
    "name": "ปลาร้าตัว",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 100.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "160",
    "name": "ตะไคร้",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 35.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "56",
    "name": "หอมแดง",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 40.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "14",
    "name": "กระเทียม",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 149.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "177",
    "name": "ข่า",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 80.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "35",
    "name": "พริกแห้ง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 282.0,
    "unit": "ถ้วย",
    "quantity": "2"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 48.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "178",
    "name": "น้ำปลาร้า",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "10",
    "name": "น้ำมะขามเปียก",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "ต้มน้ำในหม้อ ใส่ปลาร้าลงไปต้มจนสุก แล้วนำมาสับให้ละเอียด เตรียมไว้",
      "นำข่า ตะไคร้ หอมแดง และกระเทียม มาคั่วให้สุกหอม แล้วนำมาสับให้ละเอียด",
      "นำปลาร้าที่สับแล้ว และวัตถุดิบที่คั่วมาสับรวมกันจนละเอียด",
      "ปรุงรสด้วยน้ำปลาร้า น้ำตาลทราย และน้ำมะขามเปียก คนให้เข้ากัน",
      "ตักใส่ถ้วย ตกแต่งด้วยพริกขี้หนู เสิร์ฟพร้อมผักแกล้มตามชอบ"
    ],
    "videoUrl": "https://youtu.be/T5_D2gaYYxo?si=SoHrCfKeyOvJhohS",
    "diet_type": "คีโต"
  },
  {
    "id": "173",
    "title": "หมูทอดกระเทียม",
    "imageUrl": "https://api2.krua.co/wp-content/uploads/2022/03/RT1708_Gallery_-03.jpg",
    "cookTime": 60,
    "difficulty": "easy",
    "calories": 2084,
    "ingredients": [
  {
    "id": "179",
    "name": "สันคอหมู",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 260.0,
    "unit": "กรัม",
    "quantity": "500"
  },
  {
    "id": "138",
    "name": "กระเทียมไทย",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 149.0,
    "unit": "กรัม",
    "quantity": "80"
  },
  {
    "id": "180",
    "name": "พริกไทยขาวป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 255.0,
    "unit": "กรัม",
    "quantity": "8"
  },
  {
    "id": "126",
    "name": "ซอสหอยนางรม",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "17",
    "name": "ซอสปรุงรส",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "19",
    "name": "ซีอิ๊วดำ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "171",
    "name": "แป้งทอดกรอบ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 350.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "163",
    "name": "น้ำมันพืชสำหรับทอด",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "หมักหมู: หั่นสันคอหมูเป็นชิ้นพอดีคำ แล้วหมักกับซอสหอยนางรม ซอสปรุงรส น้ำตาลปี๊บ ซีอิ๊วดำ และพริกไทยขาวป่น คลุกเคล้าให้เข้ากัน พักไว้ประมาณ 30 นาที",
      "เตรียมกระเทียม: โขลกกระเทียมไทยให้ละเอียด แล้วแบ่งกระเทียมออกเป็นสองส่วน ส่วนหนึ่งใช้สำหรับหมักหมู ส่วนอีกส่วนหนึ่งใช้สำหรับเจียว",
      "เจียวกระเทียม: ตั้งกระทะใส่น้ำมันพืชบนไฟกลาง ใส่กระเทียมที่เตรียมไว้ลงไปเจียวจนเหลืองกรอบ ตักขึ้นพักไว้",
      "ทอดหมู: นำหมูที่หมักไว้มาคลุกกับแป้งทอดกรอบให้ทั่ว จากนั้นตั้งกระทะใส่น้ำมันพืชบนไฟกลาง พอน้ำมันร้อน ใส่หมูลงไปทอดจนสุกและกรอบ ตักขึ้นพักให้สะเด็ดน้ำมัน",
      "ผัดหมู: ตั้งกระทะใส่น้ำมันพืชเล็กน้อย ใส่กระเทียมเจียวที่เหลือลงไปผัดจนหอม แล้วใส่หมูทอดลงไปผัดให้เข้ากัน จนกระเทียมเคลือบหมูอย่างทั่วถึง"
    ],
    "videoUrl": "https://youtu.be/cyxyXsWg7yw?si=VZjbJH8mrOFkQ5X8",
    "diet_type": "คีโต"
  },
  {
    "id": "179",
    "title": "คอหมูย่าง",
    "imageUrl": "https://kruathaifood.com/wp-content/uploads/2024/07/thai-food-5997301_1280.jpg",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 1452,
    "ingredients": [
  {
    "id": "181",
    "name": "คอหมู",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 260.0,
    "unit": "กรัม",
    "quantity": "500"
  },
  {
    "id": "14",
    "name": "กระเทียม",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 149.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "73",
    "name": "พริกไทยเม็ด",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 255.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "182",
    "name": "ซอสปรุงรสฝาเขียว",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "4"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 16.0,
    "unit": "ช้อนชา",
    "quantity": "2"
  }
]
,
    "steps": [
      "โขลกกระเทียมและพริกไทยเม็ดให้ละเอียด",
      "ผสมกระเทียมและพริกไทยที่โขลกแล้วกับซอสปรุงรสและน้ำตาลทรายในชามผสม",
      "นำคอหมูลงไปคลุกเคล้าให้เข้ากันกับเครื่องหมัก",
      "หมักคอหมูในตู้เย็นอย่างน้อย 1 ชั่วโมง หรือหากมีเวลาสามารถหมักข้ามคืนเพื่อให้รสชาติเข้าเนื้อ",
      "นำคอหมูที่หมักแล้วมาย่างบนเตาถ่านหรือกระทะย่างจนสุกและมีสีสันน่ารับประทาน"
    ],
    "videoUrl": "https://youtu.be/5ndggeQDT1g?si=cQt7A6Bx0SuuD2Hs",
    "diet_type": "คีโต"
  },
  {
    "id": "185",
    "title": "ฉู่ฉี่กุ้ง",
    "imageUrl": "https://i.ytimg.com/vi/RuoRdmpC-Zo/maxresdefault.jpg",
    "cookTime": 45,
    "difficulty": "medium",
    "calories": 788,
    "ingredients": [
  {
    "id": "183",
    "name": "กุ้งสด ปอกเปลือกและผ่าหลัง",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 85.0,
    "unit": "กรัม",
    "quantity": "300"
  },
  {
    "id": "2",
    "name": "กะทิ",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 445.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "184",
    "name": "พริกแกงแดง",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 30.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 16.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "4",
    "name": "ใบมะกรูดฉีก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 26.0,
    "unit": "ใบ",
    "quantity": "4"
  },
  {
    "id": "51",
    "name": "ข่า (หั่นแว่น)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 29.0,
    "unit": "แว่น",
    "quantity": "3"
  },
  {
    "id": "52",
    "name": "ตะไคร้ (หั่นท่อน)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 35.0,
    "unit": "ต้น",
    "quantity": "1"
  },
  {
    "id": "185",
    "name": "พริกแดง (หั่นแฉลบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 40.0,
    "unit": "เม็ด",
    "quantity": "2"
  }
]
,
    "steps": [
      "ในกระทะ ใส่พริกแกงแดงลงไปผัดกับกะทิจนหอม",
      "ใส่ข่า ตะไคร้ และใบมะกรูดลงไป ผัดจนมีกลิ่นหอม",
      "เติมน้ำปลา น้ำตาลปี๊บ และน้ำมะนาว ชิมรสให้กลมกล่อม",
      "ใส่กุ้งลงไปในกระทะ ผัดจนกุ้งสุกและเคลือบด้วยเครื่องแกง",
      "เสิร์ฟร้อน ๆ โรยด้วยพริกแดงหั่นแฉลบและผักชีเพื่อเพิ่มความสวยงาม"
    ],
    "videoUrl": "https://youtu.be/ql6rIqoZj3I?si=ObIrlttDcMoFQWnM",
    "diet_type": "คีโต"
  },
  {
    "id": "190",
    "title": "น้ำพริกอ่อง",
    "imageUrl": "https://www.pim.in.th/images/all-side-dish-nampric/nampric-ong/nam-pric-ong-10.JPG",
    "cookTime": 30,
    "difficulty": "easy",
    "calories": 711,
    "ingredients": [
  {
    "id": "130",
    "name": "หมูสับ",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 242.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "186",
    "name": "มะเขือเทศลูกเล็ก",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 18.0,
    "unit": "ลูก",
    "quantity": "8"
  },
  {
    "id": "187",
    "name": "พริกแห้งเม็ดใหญ่ (แช่น้ำจนนิ่ม)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 282.0,
    "unit": "เม็ด",
    "quantity": "4.5"
  },
  {
    "id": "14",
    "name": "กระเทียม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 149.0,
    "unit": "กลีบ",
    "quantity": "5"
  },
  {
    "id": "56",
    "name": "หอมแดง",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 40.0,
    "unit": "หัว",
    "quantity": "3"
  },
  {
    "id": "188",
    "name": "รากผักชี (หั่นหยาบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 35.0,
    "unit": "ราก",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "80",
    "name": "เกลือเล็กน้อย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "0.5"
  },
  {
    "id": "122",
    "name": "น้ำมันพืชสำหรับผัด",
    "nutrition": "ไขมัน,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "โขลกเครื่องแกง: โขลกพริกแห้ง (ที่แช่น้ำไว้) หอมแดง กระเทียม และรากผักชีให้ละเอียด",
      "ผัดเครื่อง: ตั้งกระทะใส่น้ำมัน ใส่เครื่องแกงลงผัดจนหอม",
      "ใส่หมูสับ: ใส่หมูสับลงไปผัดจนสุก",
      "ใส่มะเขือเทศ: ใส่มะเขือเทศลงผัดให้แตกตัวเข้ากับเครื่องแกง",
      "ปรุงรส: เติมน้ำปลา น้ำตาลปี๊บ และเกลือตามชอบ ผัดจนงวดและมีกลิ่นหอม"
    ],
    "videoUrl": "https://youtu.be/tyTti2IvHZE?si=KsM5tLsJYuGuAAAx",
    "diet_type": "โปรตีนสูง"
  },
  {
    "id": "196",
    "title": "คะน้าหมูกรอบ",
    "imageUrl": "https://www.ajinomoto.co.th/storage/photos/shares/Recipe/Menu/3-13Stirfriedkale/61a8f1623ee0a.jpg\n",
    "cookTime": 30,
    "difficulty": "medium",
    "calories": 843,
    "ingredients": [
  {
    "id": "189",
    "name": "หมูกรอบ (หั่นชิ้นพอดีคำ)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 520.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "190",
    "name": "ผักคะน้า (หั่นท่อน)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 35.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "144",
    "name": "กระเทียม (สับละเอียด)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 149.0,
    "unit": "กลีบ",
    "quantity": "6"
  },
  {
    "id": "191",
    "name": "พริกขี้หนู (สับหยาบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 40.0,
    "unit": "เม็ด",
    "quantity": "7"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1.5"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "126",
    "name": "ซอสหอยนางรม",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 16.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "192",
    "name": "น้ำเปล่า (สำหรับผัด)",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  }
]
,
    "steps": [
      "ตั้งกระทะบนไฟกลาง ใส่น้ำมันพืชลงไป",
      "เมื่อกระทะร้อน ใส่กระเทียมและพริกขี้หนูสับลงไป ผัดจนหอม",
      "ใส่หมูกรอบลงไป ผัดให้เข้ากัน",
      "ใส่ผักคะน้าลงไป ผัดให้เข้ากัน",
      "ปรุงรสด้วยน้ำปลา ซอสหอยนางรม ซีอิ๊วขาว และน้ำตาลทราย ผัดให้เข้ากัน"
    ],
    "videoUrl": "https://youtu.be/wVtYVUdgOu0?si=F8WK38TO1XY47hh-",
    "diet_type": "โปรตีนสูง"
  },
  {
    "id": "203",
    "title": "กุ้งผัดพริกเกลือ",
    "imageUrl": "https://food.mthai.com/app/uploads/2017/02/Fried-shrimp-salt-pepper.jpg",
    "cookTime": 15,
    "difficulty": "medium",
    "calories": 469,
    "ingredients": [
  {
    "id": "173",
    "name": "กุ้งสด (ขนาดกลาง-ใหญ่)",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 100.0,
    "unit": "กรัม",
    "quantity": "300"
  },
  {
    "id": "193",
    "name": "พริกขี้หนูแดง (หั่นเป็นท่อน)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 40.0,
    "unit": "เม็ด",
    "quantity": "5.5"
  },
  {
    "id": "144",
    "name": "กระเทียม (สับละเอียด)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 149.0,
    "unit": "กลีบ",
    "quantity": "3"
  },
  {
    "id": "40",
    "name": "เกลือ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "126",
    "name": "ซอสหอยนางรม",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "28",
    "name": "ซอสถั่วเหลือง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 16.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "111",
    "name": "พริกไทยป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 250.0,
    "unit": "ช้อนชา",
    "quantity": "0.25"
  }
]
,
    "steps": [
      "ล้างกุ้งให้สะอาด ผ่าหลังและดึงเส้นดำออก",
      "ใส่น้ำมันพืชลงในกระทะ ตั้งไฟปานกลาง ใส่กระเทียมและพริกขี้หนูลงไปผัดจนหอม",
      "ใส่กุ้งลงไปในกระทะ ผัดจนกุ้งเปลี่ยนเป็นสีส้มและสุกทั่วถึง",
      "ใส่เกลือ, ซอสหอยนางรม, ซอสถั่วเหลือง และน้ำตาลทรายลงไป ผัดให้เข้ากัน",
      "ใส่พริกไทยป่นลงไป ผัดต่อจนทุกอย่างเข้ากันดี"
    ],
    "videoUrl": "https://youtu.be/UJ8sMAy4OhM?si=PHYEhczj1JKzGTr1",
    "diet_type": "โปรตีนสูง"
  },
  {
    "id": "209",
    "title": "กุ้งอบวุ้นเส้น",
    "imageUrl": "https://many-menu.com/wp-content/uploads/2020/11/d3160fbe-ca6e-4bb4-a299-48c419b994d2.jpg",
    "cookTime": 20,
    "difficulty": "medium",
    "calories": 884,
    "ingredients": [
  {
    "id": "173",
    "name": "กุ้งสด (ขนาดกลาง-ใหญ่)",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 100.0,
    "unit": "กรัม",
    "quantity": "300"
  },
  {
    "id": "194",
    "name": "วุ้นเส้น",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 330.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "195",
    "name": "กระเทียม (สับละเอียด)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 149.0,
    "unit": "กลีบ",
    "quantity": "3"
  },
  {
    "id": "196",
    "name": "ขึ้นฉ่าย (หั่นฝอย)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 14.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "197",
    "name": "หอมใหญ่ (หั่นเป็นชิ้น)",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 40.0,
    "unit": "หัว",
    "quantity": "1"
  },
  {
    "id": "126",
    "name": "ซอสหอยนางรม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "18",
    "name": "น้ำมันหอย",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "28",
    "name": "ซอสถั่วเหลือง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 16.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "111",
    "name": "พริกไทยป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 250.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "ไขมัน,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 120.0,
    "unit": "มล.",
    "quantity": "50"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 80.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "198",
    "name": "ขิงแก่ (หั่นแว่น)",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "แว่น",
    "quantity": "3.5"
  }
]
,
    "steps": [
      "แช่วุ้นเส้นในน้ำอุ่นประมาณ 5-10 นาที จนวุ้นเส้นนิ่ม แล้วสะเด็ดน้ำออก",
      "ล้างกุ้งให้สะอาด ผ่าหลังแล้วดึงเส้นดำออก",
      "ผสมซอสหอยนางรม, ซอสถั่วเหลือง, น้ำมันหอย, น้ำตาลทราย และพริกไทยป่นในชาม ผสมให้เข้ากัน",
      "ใส่น้ำมันพืชลงในกระทะ ตั้งไฟให้ร้อน ใส่กระเทียมและหอมใหญ่ลงไปผัดจนหอม",
      "ใส่กุ้งลงไปผัดจนเริ่มเปลี่ยนเป็นสีส้ม ใส่ขิงและเครื่องปรุงที่เตรียมไว้ ผัดให้เข้ากัน"
    ],
    "videoUrl": "https://youtu.be/eb8JRKrmxcQ?si=QaCycBLnO0GhNLdM",
    "diet_type": "โปรตีนสูง"
  },
  {
    "id": "217",
    "title": "ดักแด้ทอด",
    "imageUrl": "https://i.ytimg.com/vi/H545o9SawF0/maxresdefault.jpg",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 693,
    "ingredients": [
  {
    "id": "199",
    "name": "ดักแด้สด (ล้างสะอาด)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 180.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "171",
    "name": "แป้งทอดกรอบ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 357.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2.5"
  },
  {
    "id": "200",
    "name": "น้ำเย็น (หรือปรับตามความข้นของแป้ง)",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "0.25"
  },
  {
    "id": "40",
    "name": "เกลือ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "201",
    "name": "พริกไทย (optional)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 255.0,
    "unit": "ช้อนชา",
    "quantity": "0.25"
  },
  {
    "id": "202",
    "name": "น้ำมันพืช (สำหรับทอด)",
    "nutrition": "ไขมัน,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  }
]
,
    "steps": [
      "ล้างดักแด้ให้สะอาด ใส่ในกระชอนเพื่อสะเด็ดน้ำ",
      "ผสมแป้งทอดกรอบกับน้ำเย็นจนเป็นเนื้อเดียวกัน หากแป้งข้นเกินไปสามารถเติมน้ำได้เล็กน้อย",
      "ใส่เกลือและพริกไทยลงไปในแป้ง เพื่อเพิ่มรสชาติ",
      "ตั้งกระทะน้ำมันบนไฟกลาง ใส่น้ำมันพืชลงไปให้ร้อน (ประมาณ 180 องศาเซลเซียส)",
      "นำดักแด้ที่สะเด็ดน้ำแล้วมาชุบแป้งให้ทั่ว ๆ จากนั้นนำไปทอดในน้ำมันร้อน ๆ จนกรอบสีเหลืองทอง"
    ],
    "videoUrl": "https://youtu.be/H545o9SawF0?si=Vwu2IkWlWwhH-mnU",
    "diet_type": "โปรตีนสูง"
  },
  {
    "id": "224",
    "title": "พริกหยวกยัดไส้",
    "imageUrl": "https://www.pim.in.th/images/all-side-dish-pork/stuffed-banana-pepper-with-pork/stuffed-banana-pepper-with-pork-01.jpg",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 1691,
    "ingredients": [
  {
    "id": "203",
    "name": "หมูสับติดมัน",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 290.0,
    "unit": "กรัม",
    "quantity": "500"
  },
  {
    "id": "71",
    "name": "รากผักชี",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "73",
    "name": "พริกไทยเม็ด",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 255.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "14",
    "name": "กระเทียม",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 150.0,
    "unit": "หัว",
    "quantity": "1"
  },
  {
    "id": "40",
    "name": "เกลือ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "17",
    "name": "ซอสปรุงรส",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 10.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 400.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "0.5"
  },
  {
    "id": "117",
    "name": "ไข่ไก่",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 70.0,
    "unit": "ฟอง",
    "quantity": "1"
  },
  {
    "id": "159",
    "name": "ผักชี",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 23.0,
    "unit": "ต้น",
    "quantity": "1"
  },
  {
    "id": "204",
    "name": "พริกหยวก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 20.0,
    "unit": "เม็ด",
    "quantity": "10"
  }
]
,
    "steps": [
      "เตรียมไส้หมู: โขลกรากผักชี พริกไทยเม็ด และกระเทียมให้ละเอียด นำไปผสมกับหมูสับ ใส่เกลือ ซอสปรุงรส น้ำปลา น้ำตาลทราย ไข่ไก่ และผักชี คลุกเคล้าให้เข้ากัน หมักไว้ 30 นาที",
      "เตรียมพริกหยวก: ล้างพริกหยวกให้สะอาด ผ่าตามยาว เอาไส้และเมล็ดออก",
      "ยัดไส้: นำไส้หมูที่หมักไว้ยัดลงในพริกหยวกให้แน่น",
      "ย่าง: นำพริกหยวกยัดไส้ไปย่างบนเตาถ่านไฟอ่อนจนสุกทั่วถึง",
      "เสิร์ฟ: จัดใส่จาน เสิร์ฟพร้อมน้ำจิ้มตามชอบ"
    ],
    "videoUrl": "https://youtu.be/smNd5IoKhbQ?si=TvPLDys6xQYVQT4X",
    "diet_type": "โปรตีนสูง"
  },
  {
    "id": "229",
    "title": "ลาบปลาดุก",
    "imageUrl": "https://www.gourmetandcuisine.com/Images/cooking/recipes/recipe_889detail.jpg",
    "cookTime": 20,
    "difficulty": "medium",
    "calories": 340,
    "ingredients": [
  {
    "id": "205",
    "name": "ปลาดุกย่าง(ขนาดกลาง)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 130.0,
    "unit": "ตัว",
    "quantity": "1"
  },
  {
    "id": "62",
    "name": "หอมแดงซอย",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 40.0,
    "unit": "หัว",
    "quantity": "4.5"
  },
  {
    "id": "103",
    "name": "ต้นหอม/ผักชีฝรั่งซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "206",
    "name": "ใบสะระแหน่",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 20.0,
    "unit": "ใบ",
    "quantity": "4"
  },
  {
    "id": "102",
    "name": "ข้าวคั่ว",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 400.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "207",
    "name": "พริกป่น (ปรับตามชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 280.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1.5"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1.5"
  },
  {
    "id": "208",
    "name": "น้ำต้มสุกเล็กน้อย (ถ้าต้องการให้ลาบไม่แห้งเกินไป)",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "ย่างปลาดุกจนสุกหอม แกะเอาเฉพาะเนื้อ แล้วนำไปสับหรือยีหยาบๆ",
      "ใส่เนื้อปลาดุกในชามผสม เติมน้ำปลา น้ำมะนาว พริกป่น ข้าวคั่ว คลุกให้เข้ากัน",
      "เติมหอมแดงซอย ผักชีฝรั่ง ต้นหอม และใบสะระแหน่ คลุกเบาๆ ให้เข้ากัน",
      "เสิร์ฟพร้อมผักสด เช่น แตงกวา กะหล่ำปลี ถั่วฝักยาว",
      " ตั้งหม้อน้ำให้เดือด ใส่เนื้อเป็ดลงไปลวกจนสุก ตักขึ้นพักไว้ (หรือผัดแบบแห้งๆ ได้เช่นกัน)"
    ],
    "videoUrl": "https://youtu.be/OJ8oGE-Yt-Y?si=kLtlWj3MZh3DGHEv",
    "diet_type": "โปรตีนสูง"
  },
  {
    "id": "233",
    "title": "ลาบเป็ด",
    "imageUrl": "https://i.ytimg.com/vi/zeHSAMZyceQ/maxresdefault.jpg",
    "cookTime": 30,
    "difficulty": "easy",
    "calories": 400,
    "ingredients": [
  {
    "id": "209",
    "name": "เนื้อเป็ดสับ",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 240.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "210",
    "name": "เครื่องในเป็ด (ตับ/หัวใจ) ลวกสุก หั่นบาง (ถ้าชอบ)",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 130.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "62",
    "name": "หอมแดงซอย",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 40.0,
    "unit": "หัว",
    "quantity": "4.5"
  },
  {
    "id": "103",
    "name": "ต้นหอม/ผักชีฝรั่งซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "104",
    "name": "ใบสะระแหน่ ตามชอบ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 20.0,
    "unit": "ใบ",
    "quantity": "4"
  },
  {
    "id": "102",
    "name": "ข้าวคั่ว",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 400.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "211",
    "name": "พริกป่น(ปรับได้ตามชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 280.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1.5"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1.5"
  },
  {
    "id": "212",
    "name": "น้ำต้มสุก (สำหรับลวกเนื้อเป็ด)",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "1.5"
  }
]
,
    "steps": [
      " ตั้งหม้อน้ำให้เดือด ใส่เนื้อเป็ดลงไปลวกจนสุก ตักขึ้นพักไว้ (หรือผัดแบบแห้งๆ ได้เช่นกัน)",
      "ใส่เนื้อเป็ดลงชาม ปรุงรสด้วยน้ำปลา น้ำมะนาว ข้าวคั่ว พริกป่น คลุกเคล้าให้เข้ากัน",
      "ใส่หอมแดงซอย ผักชีฝรั่ง ต้นหอม และใบสะระแหน่ คลุกอีกครั้ง",
      "เสิร์ฟพร้อมผักสด เช่น กะหล่ำปลี แตงกวา ถั่วฝักยาว",
      "ตั้งกระทะบนไฟกลาง ใส่น้ำมันพืชลงไป พอร้อน ใส่พริกแกงลงไปผัดจนหอม"
    ],
    "videoUrl": "https://youtu.be/i217NpashRA?si=MndK6kavXkoDt8C_",
    "diet_type": "โปรตีนสูง"
  },
  {
    "id": "237",
    "title": "แกงคั่วหอยขม",
    "imageUrl": "https://i.ytimg.com/vi/1EGsW2yJytc/maxresdefault.jpg",
    "cookTime": 40,
    "difficulty": "medium",
    "calories": 1686,
    "ingredients": [
  {
    "id": "213",
    "name": "หอยขมแกะเนื้อลวกสุก",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 90.0,
    "unit": "กรัม",
    "quantity": "500"
  },
  {
    "id": "165",
    "name": "พริกแกงเผ็ด",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ,ไขมัน",
    "caloriesPerUnit": 100.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "2",
    "name": "กะทิ",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 200.0,
    "unit": "ถ้วย",
    "quantity": "2"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 320.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "214",
    "name": "ใบชะพลูหั่นหยาบ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 70.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "215",
    "name": "ใบชะอม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 50.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "4",
    "name": "ใบมะกรูดฉีก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 60.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "216",
    "name": "น้ำมันพืชสำหรับผัดพริกแกง",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "ตั้งกระทะบนไฟกลาง ใส่น้ำมันพืชลงไป พอร้อน ใส่พริกแกงลงไปผัดจนหอม",
      "ใส่กะทิลงไปผัดจนกะทิแตกมัน",
      "ใส่หอยขมลงไป ผัดให้เข้ากัน",
      "ปรุงรสด้วยน้ำปลาและน้ำตาลปี๊บ ชิมรสตามชอบ",
      "ใส่ใบชะพลู ใบชะอม และใบมะกรูดลงไป คนให้เข้ากัน"
    ],
    "videoUrl": "https://youtu.be/6XmnjDbLjJ0?si=Kwh7hex82yndLzfV",
    "diet_type": "โปรตีนสูง"
  },
  {
    "id": "244",
    "title": "ซี่โครงหมูอบน้ำผึ้ง",
    "imageUrl": "https://i.ytimg.com/vi/_iGquUkoXvU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDW1AS_CqQ7FK5jGWfUm2cNw07Z-w",
    "cookTime": 45,
    "difficulty": "easy",
    "calories": 1443,
    "ingredients": [
  {
    "id": "217",
    "name": "ซี่โครงหมู (หั่นเป็นชิ้นพอดีคำ)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 230.0,
    "unit": "กรัม",
    "quantity": "500"
  },
  {
    "id": "218",
    "name": "น้ำผึ้ง",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 330.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "3"
  },
  {
    "id": "28",
    "name": "ซอสถั่วเหลือง",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 70.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "17",
    "name": "ซอสปรุงรส",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 70.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "144",
    "name": "กระเทียม (สับละเอียด)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 149.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "219",
    "name": "น้ำมันงา (optional)",
    "nutrition": "ไขมัน,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "111",
    "name": "พริกไทยป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 255.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "220",
    "name": "งาขาว (สำหรับโรยหน้า)",
    "nutrition": "ไขมัน,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 573.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "221",
    "name": "น้ำเปล่า (สำหรับหมัก)",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  }
]
,
    "steps": [
      "ผสมส่วนผสมทุกอย่าง (น้ำผึ้ง, ซอสถั่วเหลือง, ซอสปรุงรส, กระเทียม, น้ำมันงา, พริกไทย และน้ำเปล่า) ลงในชามผสมให้เข้ากันจนเป็นน้ำหมัก",
      "นำซี่โครงหมูมาหมักในน้ำหมักที่เตรียมไว้ ทิ้งไว้ในตู้เย็นประมาณ 1-2 ชั่วโมง หรือถ้ามีเวลา หมักข้ามคืนจะยิ่งดี",
      "ตั้งเตาอบที่อุณหภูมิ 180 องศาเซลเซียส",
      "นำซี่โครงหมูที่หมักแล้วมาวางในถาดอบ ปิดฟอยล์ทับและอบในเตาประมาณ 30 นาที",
      "หลังจาก 30 นาที เปิดฟอยล์ออกแล้วอบต่ออีก 10-15 นาที หรือจนซี่โครงหมูมีสีทองและกรอบนอกนุ่มใน"
    ],
    "videoUrl": "https://youtu.be/VGvPokuSxFE?si=9j_goox6Z0ENUYPt",
    "diet_type": "โปรตีนสูง"
  },
  {
    "id": "250",
    "title": "ฟิชแอนด์ชิปส์",
    "imageUrl": "https://i.ytimg.com/vi/t-nNNt63O90/maxresdefault.jpg",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 2340,
    "ingredients": [
  {
    "id": "222",
    "name": "เนื้อปลาดอร์ลี่หรือปลาขาวอื่น ๆ",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 90.0,
    "unit": "ชิ้น",
    "quantity": "2"
  },
  {
    "id": "223",
    "name": "แป้งอเนกประสงค์",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 364.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "224",
    "name": "แป้งข้าวโพด",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 365.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "0.5",
    "name": "ผงฟู",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 53.0,
    "unit": "ช้อนชา",
    "quantity": "0.25"
  },
  {
    "id": "226",
    "name": "ผงหัวหอม (ไม่ใส่ก็ได้)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 300.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "40",
    "name": "เกลือ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "172",
    "name": "น้ำเย็นจัด",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "163",
    "name": "น้ำมันพืชสำหรับทอด",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "4"
  },
  {
    "id": "227",
    "name": "มันฝรั่ง",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 77.0,
    "unit": "หัว",
    "quantity": "4"
  },
  {
    "id": "228",
    "name": "มายองเนส",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 700.0,
    "unit": "กรัม",
    "quantity": "120"
  },
  {
    "id": "229",
    "name": "แตงกวาดองสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 12.0,
    "unit": "กรัม",
    "quantity": "20"
  },
  {
    "id": "230",
    "name": "หอมใหญ่สับ",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 40.0,
    "unit": "กรัม",
    "quantity": "20"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 22.0,
    "unit": "มล.",
    "quantity": "10"
  },
  {
    "id": "84",
    "name": "น้ำตาลทราย",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 400.0,
    "unit": "กรัม",
    "quantity": "5"
  }
]
,
    "steps": [
      "เตรียมมันฝรั่งทอด",
      "ล้างมันฝรั่งให้สะอาด หั่นเป็นชิ้นยาวโดยไม่ต้องปอกเปลือก",
      "ซับให้แห้งและผึ่งลมไว้สักครู่",
      "ตั้งกระทะใส่น้ำมันบนไฟกลาง พอน้ำมันร้อน ใส่มันฝรั่งลงไปทอดจนสุกเหลืองทอง",
      "ตักขึ้นพักให้สะเด็ดน้ำมัน"
    ],
    "videoUrl": "https://youtu.be/dcvOh2DgHVk?si=JO0W_mNIwBVDz56s",
    "diet_type": "ฟาสต์ฟู้ด"
  },
  {
    "id": "264",
    "title": "จับฉ่าย",
    "imageUrl": "https://www.ajinomoto.co.th/storage/photos/shares/Recipe/Oct/tomjubchai/633ae140ae4fe.jpg",
    "cookTime": 60,
    "difficulty": "medium",
    "calories": 1643,
    "ingredients": [
  {
    "id": "231",
    "name": "หมูสามชั้น (หั่นเป็นชิ้นขนาดพอดีคำ)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 450.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "232",
    "name": "ไก่ (หั่นเป็นชิ้นพอดีคำ)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "233",
    "name": "เห็ดหอมแห้ง (แช่น้ำให้นุ่ม)",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 284.0,
    "unit": "ดอก",
    "quantity": "4.5"
  },
  {
    "id": "234",
    "name": "หัวไชเท้า (หั่นเป็นชิ้นหนา)",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 18.0,
    "unit": "หัว",
    "quantity": "1"
  },
  {
    "id": "235",
    "name": "แครอท (หั่นเป็นชิ้นหนา)",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 41.0,
    "unit": "หัว",
    "quantity": "1"
  },
  {
    "id": "236",
    "name": "เห็ดฟาง",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 22.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "237",
    "name": "กะหล่ำปลี (หั่นเป็นชิ้นใหญ่)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "หัว",
    "quantity": "0.5"
  },
  {
    "id": "238",
    "name": "เห็ดนางฟ้า",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 33.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "239",
    "name": "ต้นหอม (หั่นท่อน)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 32.0,
    "unit": "ต้น",
    "quantity": "2"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ลิตร",
    "quantity": "1.5"
  },
  {
    "id": "28",
    "name": "ซอสถั่วเหลือง",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 320.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "155",
    "name": "ผงปรุงรส",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 270.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "40",
    "name": "เกลือ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "240",
    "name": "พริกไทย (ตามชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 250.0,
    "unit": "-",
    "quantity": "-"
  },
  {
    "id": "109",
    "name": "กระเทียม (ทุบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 149.0,
    "unit": "กลีบ",
    "quantity": "3"
  }
]
,
    "steps": [
      "ต้มน้ำในหม้อให้เดือด ใส่กระเทียมทุบลงไป",
      "ใส่หมูสามชั้นและไก่ลงไปในหม้อ ต้มจนเนื้อเริ่มนุ่ม",
      "ใส่เห็ดหอมแห้งที่แช่น้ำไว้แล้วลงไป",
      "ใส่หัวไชเท้า แครอท และกะหล่ำปลีลงไป",
      "ปรุงรสด้วยซอสถั่วเหลือง น้ำตาลปี๊บ ผงปรุงรส และเกลือ"
    ],
    "videoUrl": "https://youtu.be/qPPcLgG1z2A?si=evFyheHqewuXBwcm",
    "diet_type": "มังสวิรัติ"
  },
  {
    "id": "273",
    "title": "ตำแตง",
    "imageUrl": "https://i.ytimg.com/vi/Dz8JzJIdeMU/maxresdefault.jpg",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 127,
    "ingredients": [
  {
    "id": "241",
    "name": "แตงกวา (หั่นแฉลบหรือทุบพอแตก)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ลูก",
    "quantity": "2.5"
  },
  {
    "id": "242",
    "name": "พริกขี้หนูสวน (ปรับตามชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 40.0,
    "unit": "เม็ด",
    "quantity": "7"
  },
  {
    "id": "138",
    "name": "กระเทียมไทย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 149.0,
    "unit": "กลีบ",
    "quantity": "3.5"
  },
  {
    "id": "243",
    "name": "มะเขือเทศสีดา (ผ่าครึ่ง)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 18.0,
    "unit": "ลูก",
    "quantity": "2"
  },
  {
    "id": "244",
    "name": "น้ำปลาร้าต้มสุก (ถ้าชอบ)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2.5"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 320.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "245",
    "name": "ถั่วฝักยาว (หั่นท่อน)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 35.0,
    "unit": "ฝัก",
    "quantity": "2"
  },
  {
    "id": "246",
    "name": "ปูเค็ม (ใส่หรือไม่ใส่ก็ได้)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 90.0,
    "unit": "ตัว",
    "quantity": "1.5"
  }
]
,
    "steps": [
      "โขลกกระเทียมกับพริกขี้หนูให้แหลกพอหยาบ",
      "ใส่มะเขือเทศ ถั่วฝักยาว และปูเค็ม (ถ้าใช้) ลงไป โขลกเบา ๆ ให้พอแตก",
      "ปรุงรสด้วยน้ำปลา น้ำปลาร้า น้ำมะนาว และน้ำตาลปี๊บ คนให้เข้ากัน",
      "ใส่แตงกวาหั่นลงไป โขลกและคลุกเบา ๆ ให้เข้ากัน",
      "ชิมรสตามชอบ ตักเสิร์ฟพร้อมผักสด เช่น กะหล่ำปลี ถั่วฝักยาว ผักบุ้ง"
    ],
    "videoUrl": "https://youtu.be/C3kZW2ceewU?si=hxTikEIgEUuS9QHk",
    "diet_type": "มังสวิรัติ"
  },
  {
    "id": "278",
    "title": "ถั่วพูผัดกะปิ",
    "imageUrl": "https://i.ytimg.com/vi/_zhogiJTzEg/maxresdefault.jpg",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 400,
    "ingredients": [
  {
    "id": "247",
    "name": "ถั่วพู (หั่นเฉียง)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 45.0,
    "unit": "กรัม",
    "quantity": "200"
  },
  {
    "id": "248",
    "name": "หมูสับหรือกุ้งสด (เลือกอย่างใดอย่างหนึ่ง หรือไม่ใส่ก็ได้)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 242.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "14",
    "name": "กระเทียม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 149.0,
    "unit": "กลีบ",
    "quantity": "4"
  },
  {
    "id": "249",
    "name": "พริกขี้หนู (ตามชอบเผ็ด)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 40.0,
    "unit": "เม็ด",
    "quantity": "7"
  },
  {
    "id": "250",
    "name": "กะปิ",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 100.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "8",
    "name": "น้ำตาลปี๊บ",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 320.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "9",
    "name": "น้ำปลา",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "251",
    "name": "น้ำเปล่าเล็กน้อย",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "-"
  }
]
,
    "steps": [
      "โขลกกระเทียมกับพริกขี้หนูให้พอหยาบ",
      "ตั้งกระทะใส่น้ำมัน ใส่พริกกระเทียมโขลกลงผัดให้หอม",
      "เติมกะปิลงไปผัดให้หอมเข้ากัน",
      "ใส่หมูสับหรือกุ้งลงผัดจนสุก",
      "ใส่ถั่วพูหั่นลงผัด เติมน้ำเปล่านิดหน่อยกันแห้งเกินไป"
    ],
    "videoUrl": "https://youtu.be/_zhogiJTzEg?si=Uu3mMAuW8xYPdmVI",
    "diet_type": "มังสวิรัติ"
  },
  {
    "id": "285",
    "title": "ดอกขจรผัดน้ำมันหอย",
    "imageUrl": "https://i.ytimg.com/vi/pE7ELd6GP6c/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB1AMaBxz2-umbnzn7QJR75uFhWYA",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 319,
    "ingredients": [
  {
    "id": "252",
    "name": "ดอกขจร (ล้างสะอาดและเด็ดก้านออก)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 35.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "16",
    "name": "น้ำมันพืช",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 120.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  },
  {
    "id": "77",
    "name": "กระเทียมสับ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 149.0,
    "unit": "กลีบ",
    "quantity": "2"
  },
  {
    "id": "253",
    "name": "น้ำมันหอย (ปรับตามรสชาติ)",
    "nutrition": "โปรตีน,คาร์โบไฮเดรต,ไขมัน",
    "caloriesPerUnit": 110.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "0.5"
  },
  {
    "id": "149",
    "name": "น้ำตาล (optional)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 400.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  },
  {
    "id": "145",
    "name": "น้ำปลา (หรือปรับตามรสชาติ)",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "254",
    "name": "พริกไทยป่น (optional)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 250.0,
    "unit": "ช้อนชา",
    "quantity": "0.25"
  },
  {
    "id": "255",
    "name": "น้ำซุปหรือน้ำเปล่า(ถ้าต้องการให้ไม่แห้งเกินไป)",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  }
]
,
    "steps": [
      "ล้างดอกขจรให้สะอาด และเด็ดก้านออกให้หมด",
      "ตั้งกระทะบนไฟกลาง ใส่น้ำมันพืชลงไป รอให้น้ำมันร้อน",
      "ใส่กระเทียมสับลงไปผัดจนหอม",
      "ใส่ดอกขจรลงไปผัดประมาณ 1-2 นาที หรือจนดอกขจรเริ่มนิ่มลง",
      "เติมน้ำมันหอย, น้ำปลา และน้ำตาล (ถ้าชอบหวาน) ลงไป ผัดให้เข้ากัน"
    ],
    "videoUrl": "https://youtu.be/l8xtYZXrZgw?si=cLw4ifUg4-i5xPCk",
    "diet_type": "มังสวิรัติ"
  },
  {
    "id": "293",
    "title": "ฝักเพกาเผาใส่น้ำพริก",
    "imageUrl": "https://api2.krua.co/wp-content/uploads/2020/06/RT1150_ImageBanner_1140x507.jpg",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 90,
    "ingredients": [
  {
    "id": "256",
    "name": "ฝักเพกาอ่อน (เลือกฝักที่ยังอ่อนและไม่แข็ง)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "ฝัก",
    "quantity": "2.5"
  },
  {
    "id": "257",
    "name": "น้ำพริกตามชอบ เช่น น้ำพริกปลาร้า น้ำพริกกะปิ",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 100.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  }
]
,
    "steps": [
      "เตรียมฝักเพกา: ล้างฝักเพกาให้สะอาด ตัดส่วนปลายออกเล็กน้อย",
      "เผาฝักเพกา: นำฝักเพกาไปเผาบนเตาถ่านหรือย่างบนกระทะจนเปลือกด้านนอกไหม้และเนื้อในสุกนิ่ม (ประมาณ 5–7 นาที)",
      "ปอกเปลือก: เมื่อสุกแล้ว ปล่อยให้เย็นเล็กน้อย จากนั้นปอกเปลือกออกให้เหลือแต่เนื้อใน",
      "เสิร์ฟ: จัดใส่จาน เสิร์ฟคู่กับน้ำพริกที่เตรียมไว้",
      "เตรียมวัตถุดิบ: ล้างและหั่นฟักทอง บวบ ข้าวโพดอ่อน เห็ดฟาง / เด็ดใบแมงลัก / ปอกเปลือกกุ้งไว้"
    ],
    "videoUrl": "https://youtu.be/vcn6Yn0ZTAA?si=uoBKNbaj58Gkj_Oj",
    "diet_type": "มังสวิรัติ"
  },
  {
    "id": "297",
    "title": "แกงเลียงกุ้งสด",
    "imageUrl": "https://www.ajinomoto.co.th/storage/photos/shares/Recipe/Menu/04gangliang/614b190b4e14d.jpg",
    "cookTime": 25,
    "difficulty": "easy",
    "calories": 200,
    "ingredients": [
  {
    "id": "258",
    "name": "กุ้งสด",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 85.0,
    "unit": "กรัม",
    "quantity": "70"
  },
  {
    "id": "259",
    "name": "ฟักทอง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 26.0,
    "unit": "กรัม",
    "quantity": "40"
  },
  {
    "id": "260",
    "name": "บวบ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 14.0,
    "unit": "กรัม",
    "quantity": "40"
  },
  {
    "id": "236",
    "name": "เห็ดฟาง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 22.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "261",
    "name": "ใบแมงลัก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 26.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "262",
    "name": "ข้าวโพดอ่อน",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 31.0,
    "unit": "กรัม",
    "quantity": "10"
  },
  {
    "id": "263",
    "name": "น้ำพริกแกงเลียง",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "264",
    "name": "น้ำเปล่า(สำหรับต้ม)",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  }
]
,
    "steps": [
      "เตรียมวัตถุดิบ: ล้างและหั่นฟักทอง บวบ ข้าวโพดอ่อน เห็ดฟาง / เด็ดใบแมงลัก / ปอกเปลือกกุ้งไว้",
      "ต้มน้ำซุป: ตั้งหม้อน้ำเปล่าให้เดือด ใส่น้ำพริกแกงเลียงลงไป คนให้ละลาย",
      "ใส่ผัก: ใส่ฟักทอง บวบ เห็ดฟาง ข้าวโพดอ่อน ต้มจนผักเริ่มนิ่ม",
      "ใส่กุ้ง: ใส่กุ้งลงไปในน้ำเดือด ต้มต่อประมาณ 2-3 นาทีจนกุ้งสุก",
      "ปรุงรส: เติมซีอิ๊วขาวตามชอบ"
    ],
    "videoUrl": "https://youtu.be/pB3XqaOjmNM?si=lBI55ppFNDHyTaDQ",
    "diet_type": "สุขภาพ"
  },
  {
    "id": "304",
    "title": "ต้มยำเห็ดรวม",
    "imageUrl": "https://i.ytimg.com/vi/HaEHkesXL7A/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDaj_O-y7J0ho8wy8GKqnlfWdGcVA",
    "cookTime": 20,
    "difficulty": "easy",
    "calories": 100,
    "ingredients": [
  {
    "id": "238",
    "name": "เห็ดนางฟ้า",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 22.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "236",
    "name": "เห็ดฟาง",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 22.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "265",
    "name": "เห็ดเข็มทอง",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 37.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "177",
    "name": "ข่า",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 80.0,
    "unit": "แว่น",
    "quantity": "3"
  },
  {
    "id": "160",
    "name": "ตะไคร้",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 99.0,
    "unit": "ต้น",
    "quantity": "1"
  },
  {
    "id": "4",
    "name": "ใบมะกรูดฉีก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 200.0,
    "unit": "ใบ",
    "quantity": "2"
  },
  {
    "id": "249",
    "name": "พริกขี้หนู (ตามชอบเผ็ด)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 40.0,
    "unit": "เม็ด",
    "quantity": "3"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "เตรียมเครื่องสมุนไพร: หั่นข่าเป็นแว่น ทุบตะไคร้และหั่นท่อน ฉีกใบมะกรูด",
      "ต้มน้ำซุป: ใส่น้ำลงหม้อ นำข่า ตะไคร้ ใบมะกรูด ลงต้มจนน้ำหอม (~5 นาที)",
      "ใส่เห็ด: ใส่เห็ดทั้งหมดลงไป ต้มจนเห็ดสุก (~5 นาที)",
      "ปรุงรส: เติมซีอิ๊วขาวหรือน้ำปลา ใส่น้ำมะนาว และพริกขี้หนูบุบ ปรับรสตามชอบ",
      "เสิร์ฟร้อน ๆ: รับประทานได้ทันที หรือเพิ่มผักชี/ขึ้นฉ่ายสำหรับตกแต่ง"
    ],
    "videoUrl": "https://youtu.be/HaEHkesXL7A?si=y68qZCx0nb5KmLDV",
    "diet_type": "สุขภาพ"
  },
  {
    "id": "309",
    "title": "โจ๊กข้าวโอ๊ตใส่อกไก่",
    "imageUrl": "https://i.ytimg.com/vi/3wOl0UhVikg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCEDENTHeLU5YOhWzihSdnqbV4WZw",
    "cookTime": 25,
    "difficulty": "easy",
    "calories": 272,
    "ingredients": [
  {
    "id": "266",
    "name": "ข้าวโอ๊ต(แบบสุกเร็ว)",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 389.0,
    "unit": "กรัม",
    "quantity": "40"
  },
  {
    "id": "267",
    "name": "อกไก่",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "60"
  },
  {
    "id": "74",
    "name": "น้ำเปล่า",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "1.5"
  },
  {
    "id": "268",
    "name": "ขิงซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 80.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "66",
    "name": "ต้นหอมซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 32.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "180",
    "name": "พริกไทยขาวป่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 296.0,
    "unit": "ช้อนชา",
    "quantity": "0.25"
  }
]
,
    "steps": [
      "ต้มอกไก่ ในน้ำเปล่าจนสุก (ใช้เวลาประมาณ 10–12 นาที) แล้วฉีกเป็นเส้น",
      "ใส่ข้าวโอ๊ต ลงในน้ำต้มไก่ที่เดือด คนนานประมาณ 3–5 นาทีจนข้าวโอ๊ตนุ่ม",
      "ใส่ ขิงซอย และ เนื้อไก่ฉีก ลงไป คนให้เข้ากัน",
      "ปรุงรสด้วย ซีอิ๊วขาว และโรย ต้นหอม + พริกไทยขาว",
      "เสิร์ฟร้อน ๆ เป็นอาหารเช้าหรือมื้อเย็นแบบเบาๆ"
    ],
    "videoUrl": "https://youtu.be/3wOl0UhVikg?si=WsviWbmRTPcEja9Q",
    "diet_type": "สุขภาพ"
  },
  {
    "id": "314",
    "title": "แกงส้มผักรวมใส่ปลา",
    "imageUrl": "https://i.ytimg.com/vi/oUIiVbJJPk4/maxresdefault.jpg",
    "cookTime": 30,
    "difficulty": "medium",
    "calories": 209,
    "ingredients": [
  {
    "id": "269",
    "name": "ปลาทับทิม",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 128.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "270",
    "name": "มะละกอดิบซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 27.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "271",
    "name": "ถั่วฝักยาวหั่นท่อน",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 34.0,
    "unit": "กรัม",
    "quantity": "40"
  },
  {
    "id": "272",
    "name": "แครอทหั่นแว่น",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 41.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "273",
    "name": "กะหล่ำปลีหั่นหยาบ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 25.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "274",
    "name": "น้ำพริกแกงส้ม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 60.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "10",
    "name": "น้ำมะขามเปียก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "275",
    "name": "น้ำปลา / เกลือ",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 5.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "276",
    "name": "น้ำเปล่า (ต้มแกง)",
    "nutrition": "ไม่ระบุ",
    "caloriesPerUnit": 0.0,
    "unit": "ถ้วย",
    "quantity": "2"
  }
]
,
    "steps": [
      "ต้มน้ำให้เดือด ใส่น้ำพริกแกงส้ม คนให้ละลาย",
      "ใส่น้ำมะขามเปียก ปรุงรสด้วยน้ำปลา",
      "ใส่ปลา (หั่นชิ้นพอดีคำ) ลงต้มจนสุก ระวังอย่าคนแรง",
      "ใส่ผักตามลำดับสุกง่าย–ยาก เช่น มะละกอ → แครอท → ถั่วฝักยาว → กะหล่ำปลี",
      "เคี่ยวจนผักนุ่ม ชิมรสให้ออกเปรี้ยว เค็ม เผ็ดตามชอบ"
    ],
    "videoUrl": "https://youtu.be/ZQEuY7dippk?si=tX-KbtExRK77wtsP",
    "diet_type": "สุขภาพ"
  },
  {
    "id": "320",
    "title": "สุกี้น้ำรวมมิตร",
    "imageUrl": "https://yalamarketplace.com/upload/1662970645713.jpg",
    "cookTime": 30,
    "difficulty": "easy",
    "calories": 318,
    "ingredients": [
  {
    "id": "277",
    "name": "กุ้งสด (ปอกเปลือก)",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 85.0,
    "unit": "ตัว",
    "quantity": "4"
  },
  {
    "id": "278",
    "name": "ปลาหมึก (หั่นชิ้น)",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 92.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "279",
    "name": "เต้าหู้ขาวแข็ง",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 145.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "280",
    "name": "วุ้นเส้น (แช่น้ำแล้ว)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 80.0,
    "unit": "กรัม",
    "quantity": "40"
  },
  {
    "id": "281",
    "name": "ผักกาดขาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 13.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "282",
    "name": "ผักบุ้งจีน",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 23.0,
    "unit": "กรัม",
    "quantity": "40"
  },
  {
    "id": "283",
    "name": "ขึ้นฉ่าย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 16.0,
    "unit": "กรัม",
    "quantity": "10"
  },
  {
    "id": "265",
    "name": "เห็ดเข็มทอง",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 37.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "284",
    "name": "ไข่ไก่ (ตีผสมในน้ำซุป)",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 143.0,
    "unit": "ฟอง",
    "quantity": "1"
  },
  {
    "id": "285",
    "name": "น้ำซุปกระดูก / น้ำเปล่า",
    "nutrition": "โปรตีน",
    "caloriesPerUnit": 10.0,
    "unit": "ถ้วย",
    "quantity": "2"
  },
  {
    "id": "286",
    "name": "น้ำจิ้มสุกี้ (งดถ้าเฮลตี้)",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 60.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "2"
  }
]
,
    "steps": [
      "เตรียมวัตถุดิบ: ล้างและหั่นผัก เตรียมวุ้นเส้นแช่น้ำให้นิ่ม ปอกเปลือกกุ้ง หั่นปลาหมึก",
      "ทำน้ำซุป: ต้มน้ำในหม้อ ใส่น้ำซุปกระดูกหรือน้ำเปล่า นำเต้าหู้หั่นชิ้นใส่ลงไป",
      "ใส่โปรตีน: ใส่กุ้ง ปลาหมึก และไข่ คนเบา ๆ จนไข่สุกเล็กน้อย",
      "ใส่ผักและวุ้นเส้น: ตามด้วยผักทั้งหมดและวุ้นเส้น ต้มให้ทุกอย่างสุก",
      "ปรุงรสเล็กน้อย (ถ้าต้องการ): เติมซีอิ๊วขาวหรือน้ำตาลเล็กน้อย หรือใช้น้ำจิ้มสุกี้เสริม"
    ],
    "videoUrl": "https://youtu.be/sTQyAWZpB7M?si=mhjkPiPnAYK7ptcw",
    "diet_type": "สุขภาพ"
  },
  {
    "id": "325",
    "title": "ข้าวโพดคลุกทูน่า",
    "imageUrl": "https://i.ytimg.com/vi/gGVzjI-1U8s/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCMmFbE7h0OoNw2ccZJ9MqJEymDtw",
    "cookTime": 15,
    "difficulty": "easy",
    "calories": 241,
    "ingredients": [
  {
    "id": "287",
    "name": "ข้าวโพดต้ม (ฝานเมล็ด)",
    "nutrition": "คาร์โบไฮเดรต",
    "caloriesPerUnit": 96.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "288",
    "name": "ทูน่ากระป๋องในน้ำแร่",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 120.0,
    "unit": "กระป๋อง",
    "quantity": "1"
  },
  {
    "id": "62",
    "name": "หอมแดงซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 40.0,
    "unit": "กรัม",
    "quantity": "10"
  },
  {
    "id": "23",
    "name": "น้ำมะนาว",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 6.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  },
  {
    "id": "289",
    "name": "พริกขี้หนูซอย",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "เม็ด",
    "quantity": "2"
  },
  {
    "id": "121",
    "name": "ซีอิ๊วขาว",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 5.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  }
]
,
    "steps": [
      "เตรียมวัตถุดิบ: ฝานเมล็ดข้าวโพดต้ม หั่นหอมแดงและพริกขี้หนู",
      "ผสมวัตถุดิบ: ใส่ข้าวโพด ทูน่า หอมแดงซอย พริก น้ำมะนาว และซีอิ๊วขาวลงในชาม",
      "คลุกให้เข้ากัน: คนเบา ๆ ให้เข้ากันดี หากต้องการให้เนื้อเนียนนุ่มอาจเติมมายองเนส low-fat เล็กน้อย",
      "จัดเสิร์ฟ: ตักใส่จาน พร้อมเสิร์ฟทันที หรือแช่เย็นไว้ทานแบบเย็น ๆ ก็ได้",
      "ล้างผักสลัดให้สะอาด สะเด็ดน้ำ"
    ],
    "videoUrl": "https://youtu.be/i-wHnR14lh4?si=XD9E0A-WaeguezsC",
    "diet_type": "อาหารคลีน"
  },
  {
    "id": "329",
    "title": "สลัดอกไก่",
    "imageUrl": "https://i.ytimg.com/vi/0rseP0Vwt3k/maxresdefault.jpg",
    "cookTime": 20,
    "difficulty": "easy",
    "calories": 266,
    "ingredients": [
  {
    "id": "290",
    "name": "อกไก่ลอกหนังต้ม",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "291",
    "name": "ผักสลัด (กรีนโอ๊ค/เรดโอ๊ค)",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 13.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "292",
    "name": "มะเขือเทศราชินี",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 18.0,
    "unit": "ลูก",
    "quantity": "5"
  },
  {
    "id": "293",
    "name": "แตงกวา",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 8.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "294",
    "name": "แครอทขูด",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 12.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "295",
    "name": "น้ำสลัดงาญี่ปุ่น (low fat)",
    "nutrition": "ไขมัน,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "ล้างผักสลัดให้สะอาด สะเด็ดน้ำ",
      "หั่นอกไก่เป็นชิ้นพอดีคำ ต้มในน้ำเดือดจนสุก (ประมาณ 7–10 นาที) แล้วพักไว้",
      "หั่นแตงกวา, มะเขือเทศ, ขูดแครอทเตรียมไว้",
      "วางผักสลัดเป็นฐาน",
      "ใส่อกไก่ต้ม แตงกวา มะเขือเทศ แครอทลงไป"
    ],
    "videoUrl": "https://youtu.be/0rseP0Vwt3k?si=WBx1Sw5VU8EAzfEs",
    "diet_type": "อาหารคลีน"
  },
  {
    "id": "336",
    "title": "สเต๊กปลาแซลมอน",
    "imageUrl": "https://i.ytimg.com/vi/lS-VzG8DOVI/maxresdefault.jpg",
    "cookTime": 25,
    "difficulty": "medium",
    "calories": 424,
    "ingredients": [
  {
    "id": "296",
    "name": "ปลาแซลมอนสด (ไม่ติดหนัง)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 208.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "297",
    "name": "คีนัวต้มสุก",
    "nutrition": "โปรตีน,คาร์โบไฮเดรต",
    "caloriesPerUnit": 111.0,
    "unit": "ถ้วย",
    "quantity": "0.25"
  },
  {
    "id": "298",
    "name": "ผักสลัดรวม",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ถ้วย",
    "quantity": "1"
  },
  {
    "id": "299",
    "name": "น้ำมันมะกอก (ใช้ย่างปลา)",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 40.0,
    "unit": "ช้อนชา",
    "quantity": "1"
  },
  {
    "id": "300",
    "name": "น้ำสลัดงา (low fat)",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 50.0,
    "unit": "ช้อนโต๊ะ",
    "quantity": "1"
  }
]
,
    "steps": [
      "ซับน้ำให้แห้ง โรยเกลือ/พริกไทยเล็กน้อย (หากต้องการ)",
      "ตั้งกระทะเทฟลอน ใส่น้ำมันมะกอกเล็กน้อย",
      "ย่างแซลมอนด้วยไฟกลางประมาณ 3–4 นาทีต่อด้าน (ให้เนื้อสุกแต่ยังชุ่ม)",
      "ล้างคีนัวแล้วต้มในน้ำเปล่า (อัตรา 1:2) ประมาณ 15 นาที จนนุ่มและน้ำแห้ง",
      "วางผักสลัดบนจาน ใส่คีนัวต้ม และวางปลาแซลมอนด้านบน"
    ],
    "videoUrl": "https://youtu.be/lS-VzG8DOVI?si=Rr6Xk7MAjJuEjASz",
    "diet_type": "อาหารคลีน"
  },
  {
    "id": "342",
    "title": "บะหมี่ผักอกไก่ต้มแห้ง",
    "imageUrl": "https://img-global.cpcdn.com/recipes/ba312644dedb086a/1200x630cq70/photo.jpg",
    "cookTime": 20,
    "difficulty": "easy",
    "calories": 400,
    "ingredients": [
  {
    "id": "301",
    "name": "บะหมี่ผัก (เส้นไม่ทอด)",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 190.0,
    "unit": "ก้อน",
    "quantity": "1"
  },
  {
    "id": "302",
    "name": "อกไก่ต้ม (ไม่ติดหนัง)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "303",
    "name": "ถั่วงอกลวก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 15.0,
    "unit": "ถ้วย",
    "quantity": "0.5"
  },
  {
    "id": "304",
    "name": "ผักกวางตุ้งลวก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 10.0,
    "unit": "ถ้วย",
    "quantity": "0.5"
  },
  {
    "id": "305",
    "name": "แครอทลวก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 12.0,
    "unit": "ถ้วย",
    "quantity": "0.25"
  },
  {
    "id": "306",
    "name": "น้ำมันงา (คลุกเส้นเล็กน้อย)",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "ต้มอกไก่ในน้ำเดือดประมาณ 10 นาทีจนสุก",
      "พักให้เย็น แล้วฉีกเป็นเส้น ๆ",
      "นำผักกวางตุ้ง แครอท และถั่วงอกไปลวกให้สุกกรอบ",
      "ตักขึ้นพักไว้ให้สะเด็ดน้ำ",
      "ต้มบะหมี่ในน้ำเดือดจนเส้นนุ่ม (ประมาณ 2–3 นาที)"
    ],
    "videoUrl": "https://youtu.be/8o6B05xsWGg?si=CWCeaTTPZwbtbCBy",
    "diet_type": "อาหารคลีน"
  },
  {
    "id": "350",
    "title": "ข้าวกล้องอกไก่ย่าง + ไข่ต้ม + ผักลวก",
    "imageUrl": "https://www.thammculture.com/wp-content/uploads/2022/06/Untitled-225.jpg",
    "cookTime": 30,
    "difficulty": "easy",
    "calories": 406,
    "ingredients": [
  {
    "id": "307",
    "name": "อกไก่ (ไม่ติดหนัง)",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 165.0,
    "unit": "กรัม",
    "quantity": "100"
  },
  {
    "id": "308",
    "name": "ข้าวกล้องหุงสุก",
    "nutrition": "คาร์โบไฮเดรต,วิตามินและแร่ธาตุ",
    "caloriesPerUnit": 111.0,
    "unit": "กรัม",
    "quantity": "75"
  },
  {
    "id": "309",
    "name": "ไข่ไก่ต้ม",
    "nutrition": "โปรตีน,ไขมัน",
    "caloriesPerUnit": 70.0,
    "unit": "ฟอง",
    "quantity": "1"
  },
  {
    "id": "310",
    "name": "บรอกโคลีลวก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 18.0,
    "unit": "กรัม",
    "quantity": "50"
  },
  {
    "id": "305",
    "name": "แครอทลวก",
    "nutrition": "วิตามินและเกลือแร่",
    "caloriesPerUnit": 12.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "311",
    "name": "ถั่วฝักยาวลวก",
    "nutrition": "โปรตีน,วิตามินและแร่ธาตู",
    "caloriesPerUnit": 10.0,
    "unit": "กรัม",
    "quantity": "30"
  },
  {
    "id": "312",
    "name": "น้ำมันมะกอก (พ่นบาง ๆ)",
    "nutrition": "ไขมัน",
    "caloriesPerUnit": 20.0,
    "unit": "ช้อนชา",
    "quantity": "0.5"
  }
]
,
    "steps": [
      "ย่างอกไก่: หมักอกไก่กับพริกไทย กระเทียม และน้ำมันมะกอกเล็กน้อย แล้วนำมาย่างบนกระทะหรือหม้อทอดไร้น้ำมัน จนสุกดี",
      "ต้มไข่: ใช้เวลาต้ม 6–8 นาที (ขึ้นอยู่กับความสุกที่ต้องการ)",
      "ลวกผัก: ลวกผักในน้ำเดือด 1–2 นาที แล้วนำขึ้นพักให้สะเด็ดน้ำ",
      "จัดจาน: วางข้าวกล้อง + อกไก่ย่าง + ไข่ต้ม + ผักลวก พร้อมเสิร์ฟ"
    ],
    "videoUrl": "https://www.youtube.com/shorts/XDsh1TeOgjY",
    "diet_type": "อาหารคลีน"
  }
];
export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: loadRecipes(),
  favoriteRecipes: [],
  searchResults: [],
  popularRecipes: mockRecipes.slice(0, 6),

  searchRecipes: (query: string, filters: string[] = []) => {
    const keywordList = query
      .split(',')
      .map((q) => q.trim().toLowerCase())
      .filter((q) => q.length > 0);

    const results = get().recipes.filter((recipe) => {
      const normalizedTitle = recipe.title.toLowerCase().trim();
      const normalizedIngredients = recipe.ingredients.map((ing) =>
        ing.name.toLowerCase().trim()
      );

      const matchQuery =
        keywordList.length === 0
          ? true
          : keywordList.some(
              (q) =>
                normalizedTitle.includes(q) ||
                normalizedIngredients.some((ing) => ing.includes(q))
            );

      const matchFilter =
        filters.length === 0
          ? true
          : filters.some(
              (filter) =>
                (recipe.diet_type || '').toLowerCase() === filter.toLowerCase() ||
                normalizedIngredients.some((ing) =>
                  ing.includes(filter.toLowerCase())
                )
            );

      return matchQuery && matchFilter;
    });

    set({ searchResults: results });
  },

  toggleFavorite: (recipeId: string) => {
    const { favoriteRecipes } = get();
    const updated = favoriteRecipes.includes(recipeId)
      ? favoriteRecipes.filter((id) => id !== recipeId)
      : [...favoriteRecipes, recipeId];
    set({ favoriteRecipes: updated });
  },

  getRandomRecipe: () => {
    const { recipes } = get();
    if (recipes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * recipes.length);
    return recipes[randomIndex];
  },

  getRecipeById: (id: string) => {
    return get().recipes.find((r) => r.id === id) || null;
  },

  addRecipe: (recipe: Recipe) => {
    const updated = [...get().recipes, recipe];
    saveRecipes(updated);
    set({ recipes: updated });
  },

  updateRecipe: (updated: Recipe) => {
    const newList = get().recipes.map((r) => (r.id === updated.id ? updated : r));
    saveRecipes(newList);
    set({ recipes: newList });
  },

  deleteRecipe: (id: string) => {
    const updated = get().recipes.filter((r) => r.id !== id);
    saveRecipes(updated);
    set({ recipes: updated });
  }
}));