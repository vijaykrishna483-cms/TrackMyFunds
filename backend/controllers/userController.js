import { pool } from "../libs/database.js";
import { comparePassword, hashPassword } from "../libs/index.js";
export const getUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const userExist = await pool.query({
      text: 'SELECT * FROM tbluser WHERE id = $1',
      values: [userId]
    });

    const user = userExist.rows[0];

    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

  
    return res.status(200).json({ status: "success", data: user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};


export const changePassword=async (req,res)=>{

    try {
        const {userId} =req.user;
        const {currentPassword,newPassword,confirmPassword}=req.body;
        const userExist = await pool.query({
            text: 'SELECT * FROM tbluser WHERE id = $1',
            values: [userId]
        })
        const user= userExist.rows[0];
        if(!user){
            return res.status(404).json({ status:"failed", message:"User not found" });
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({ status:"failed", message:"Password do not match" });
        }
        const isMatch =await comparePassword(currentPassword, user?.password);
        if(!isMatch){
            return res.status(401).json({ status:"failed", message:"Invalid current password" });
        }
        const hashedPassword = await hashPassword(newPassword);
       await pool.query({
            text: 'UPDATE tbluser SET password = $1 WHERE id = $2 RETURNING *',
            values: [hashedPassword,userId]
        })
        res.status(200).json({ status:"success", message:"Password changed successfully" });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ status:"failed", message:error.message });
        
    }
}

export const updateUser=async (req,res)=>{

    try {
        const {userId} =req.user;
        const {firstname,lastname,country,currency,contact}=req.body;
        const userExist = await pool.query({
            text: 'SELECT * FROM tbluser WHERE id = $1',
            values: [userId]
        })
        const user= userExist.rows[0];
        if(!user){
            return res.status(404).json({ status:"failed", message:"User not found" });
        }
        const updatedUser = await pool.query({
            text: 'UPDATE tbluser SET firstname = $1, lastname = $2, country = $3, currency = $4 ,contact = $5, updatedat=CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            values: [firstname,lastname,country,currency, contact,userId]
        })
        updatedUser.rows[0].password = undefined;
        res.status(200).json({ status:"success", message:"User updated successfully", data:updatedUser.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status:"failed", message:error.message });
        
    }
}



// export const signinUser=async (req,res)=>{

//     try {
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status:"failed", message:error.message });
        
//     }
// }