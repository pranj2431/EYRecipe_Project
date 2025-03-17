import React, { useState, useEffect } from "react";
import axios from "axios";

const RecipeApp = () => {
    const [recipes, setRecipes] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        ingredients: "",
        instructions: "",
        image: "",
        author: "",
    });
    const [preview, setPreview] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [username, setUsername] = useState("Anonymous");

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            axios.get("https://eyrecipe-project-1.onrender.com/user", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => setUsername(res.data.username))
                .catch((err) => {
                    console.error("Error fetching user details:", err);
                    setUsername("Anonymous");
                });
        }
    }, []);

    useEffect(() => {
        axios.get("https://eyrecipe-project-1.onrender.com/recipes")
            .then((res) => setRecipes(Array.isArray(res.data) ? res.data : res.data.data))
            .catch((err) => console.error("Error fetching recipes:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newRecipe = {
                title: formData.title,
                ingredients: formData.ingredients.split("\n"),
                instructions: formData.instructions.split("\n"),
                image: preview || "",
                author: formData.author || username,
            };

            console.log("Submitting Recipe:", newRecipe);

            const token = localStorage.getItem("userToken");
            if (token) {
                try {
                    const res = await axios.post("https://eyrecipe-project-1.onrender.com/addrecipes", newRecipe, { headers: { Authorization: `Bearer ${token}` } });
                    setRecipes((prev) => [res.data, ...prev]);
                    setSubmitted(true);
                    setTimeout(() => setSubmitted(false), 3000);
                    setFormData({ title: "", ingredients: "", instructions: "", image: "", author: "" });
                    setPreview("");
                } catch (err) {
                    console.error("Error submitting recipe:", err.response ? err.response.data : err.message);
                }
            } else {
                console.error("No authorization token found.");
            }
        }
    };

    const validateForm = () => {
        return formData.title.trim() && formData.ingredients.trim() && formData.instructions.trim() && preview;
    };

    const resizeImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const maxWidth = 500;
                    const scaleSize = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scaleSize;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL("image/jpeg", 0.7));
                };
            };
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const resizedImage = await resizeImage(file);
            setPreview(resizedImage);
        }
    };

    return (
        <section className="recipe-app py-5">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6 d-none d-md-block">
                        <img
                            src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                            alt="Cooking"
                            className="img-fluid rounded-3"
                        />

                    </div>
                    <div className="col-md-6">
                        <h2 className="mb-4">Share Your Secret Recipe</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="text" className="form-control mb-3" placeholder="Recipe Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            <textarea className="form-control mb-3" rows="3" placeholder="Ingredients (one per line)" value={formData.ingredients} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })} required></textarea>
                            <textarea className="form-control mb-3" rows="5" placeholder="Step-by-Step Instructions" value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} required></textarea>
                            <input type="text" className="form-control mb-3" placeholder="Author Name (optional)" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
                            <div className="mb-3">
                                <label className="d-block mb-2">Add Recipe Image</label>
                                <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                                {preview && <img src={preview} alt="Preview" className="img-thumbnail mt-2" style={{ width: "80px", height: "80px" }} />}
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={!validateForm()}>Share Recipe</button>
                            {submitted && <div className="alert alert-success mt-3">Recipe submitted successfully!</div>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecipeApp;