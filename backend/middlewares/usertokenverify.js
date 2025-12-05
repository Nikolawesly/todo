import jwt from 'jsonwebtoken';
const {verify} = jwt;
export const verifyToken = ((req,res,next)=>{
    //read token in res cookie

    console.log(req.cookies.token)

    const encryptedToken = req.cookies.token;
    //if token not available
    if(!encryptedToken){
        res.json({
            message:"Unauthorized Access"
        })
    }
    else{
        //verify the token
        try{
            const  decodedToken = verify(encryptedToken,"abcdef");
            next();
        } catch(err){
            res.json({
                message:"Session expired. please re-login"
            })
        }
    }
});