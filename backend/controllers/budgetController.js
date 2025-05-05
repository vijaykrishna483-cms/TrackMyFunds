import { pool } from "../libs/database.js";

export const addBudget=async (req,res)=>{

    try {
        const {userId}=req.user;
        const {description , goalamount}=req.body;
        const goalExist = await pool.query({
            text: "SELECT * FROM tblbudgets WHERE description = $1 AND user_id = $2",
            values:[description,userId]
        })
        const existGoal = goalExist.rows[0];
      
      if (existGoal) {
        return res
          .status(400)
          .json({ status: "failed", message: "Goal already fixed" });
      }

      const createGoalresult = await pool.query({
        text: "INSERT INTO tblbudgets (user_id,description,goalamount) VALUES ($1,$2,$3) RETURNING *",
        values: [userId, description,goalamount],
      });
      const newGoal = createGoalresult.rows[0];

      res.status(201).json({
        status: "success",
        message:"New Goal fixed",
        data: newGoal,
      });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status:"failed", message:error.message });
        
    }
}


export const getBudgets=async (req,res)=>{

    try {
        const { userId } = req.user;
        const goals = await pool.query({
            text: "SELECT * FROM tblbudgets WHERE user_id = $1",
            values: [userId],
          });
          res.status(200).json({
            status: "success",
            message: "Goals fetched successfully",
            data: goals.rows,
          });
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