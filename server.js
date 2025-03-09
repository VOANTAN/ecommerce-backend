const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB (Thay username:password bằng tài khoản của bạn)
mongoose.connect('mongodb+srv://nguyenvantoanv5:D6Z30uA932mxOg3o@cluster0.ylq6z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Đã kết nối MongoDB"))
.catch(err => console.log("❌ Lỗi kết nối MongoDB", err));

// Định nghĩa Schema cho sản phẩm
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String
});
const Product = mongoose.model('Product', productSchema);

// API lấy danh sách sản phẩm
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// API thêm sản phẩm mới
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ message: "Sản phẩm đã được thêm!", product: newProduct });
});

// API xóa sản phẩm
app.delete('/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Sản phẩm đã bị xóa!" });
});

// API cập nhật sản phẩm
app.put('/products/:id', async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Sản phẩm đã được cập nhật!", product: updatedProduct });
});

// Khởi động server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`));
// Thêm sản phẩm mẫu vào database (Chạy 1 lần rồi có thể xoá)
async function seedDatabase() {
    const count = await Product.countDocuments();
    if (count === 0) {
        await Product.insertMany([
            { name: "Laptop Dell XPS 15", price: 35000000, category: "electronics", image: "https://example.com/laptop.jpg" },
            { name: "Áo Thun Nam", price: 250000, category: "fashion", image: "https://example.com/tshirt.jpg" },
            { name: "Điện thoại iPhone 13", price: 25000000, category: "electronics", image: "https://example.com/iphone.jpg" }
        ]);
        console.log("✅ Đã thêm sản phẩm mẫu vào MongoDB!");
    }
}
seedDatabase();
