import productModels from '../models/ProductModel.js';
import path from 'path';
import fs from 'fs';

export const getProducts = async (req, res) => {
    try {
        const response = await productModels.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getProductByID = async (req, res) => {
    try {
        const response = await productModels.findOne({
            where: {
                id: req.params.id
            }
        }); 
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const saveProduct = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No file uploaded"});

    const name = req.body.title;
    const price = req.body.price;
    const desc = req.body.desc;
    const file = req.files.file;
    console.log('Uploaded files:', req.files);
    const fileSize = file.data.length;
    const ext = path.extname (file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg:'invaled image'});
    if (fileSize > 5000000) return res.status(422).json({msg:'Image must be less than 5 mb'});

    // file uploaded will be saved here (folder & db)
    file.mv(`./public/images/${fileName}`, async (err)=> {
        if (err) return res.status(500).json({msg: err.message});  
        // save in db
        try {
            await productModels.create({
                fname: name, 
                fprice: price,
                fdesc: desc, 
                fimage: fileName, 
                furl: url 
            });
            res.status(201).json({msg: 'File has been uploaded!'})
        } catch (error) {
            console.log (error.message);
        }
    });
}

export const updateProduct = async (req, res) => {
    const product = await productModels.findOne({
        where: {
            id: req.params.id
        }
    }); 
    if (!product) return res.status(404).json ({msg:"Data not found."});

    // if no image uploaded, using image provided in db, else : update image in db
    let fileName = "";
    if (req.files === null) {
        fileName = productModels.fimage;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname (file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];
    
        if(!allowedType.includes(ext.toLowerCase())) return res.status(442).json({msg:'invaled image'});
        if (fileSize > 5000000) return res.status(442).json({msg:'Image must be less than 5 mb'});

        // delete file from folder
        const filePath = `public/images/${product.fimage}`;
        fs.unlinkSync(filePath);

        // then upload file and will be saved here (folder)
        file.mv(`./public/images/${fileName}`, async (err)=> {
            if (err) return res.status(500).json({msg: err.message});
        });
    }
    // then save in db
    const name = req.body.title;
    const price = req.body.price;
    const desc = req.body.desc;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`; 
    try {
        await productModels.update({
            fname: name, 
            fprice: price,
            fdesc: desc,
            fimage: fileName, 
            furl: url
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: 'File has been updated.'})
    } catch (error) {
        console.log(error.message);
    }
} 

export const deleteProduct = async (req, res) => {
    const product = await productModels.findOne({
        where: {
            id: req.params.id 
        }
    }); 
    if (!product) return res.status(404).json ({msg:"No data found."});

    try {
        // delete file from folder
        const filePath = `public/images/${product.fimage}`;
        fs.unlinkSync(filePath);
        // delete file from database
        await productModels.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: 'File deleted successfully'})
    } catch (error) {
        console.log(error.message);
    }
}







