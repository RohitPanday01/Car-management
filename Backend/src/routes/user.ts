import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'


export const userrouter = new Hono<{
    Bindings: {
      JWT_SECRET: string;
      DATABASE_URL: string;
    }
  }>();


// for password hashing 
async function hashPassword(password: string, email: string): Promise<string> {
if (!password || !email) {
    throw new Error("Password and email cannot be null or empty");
}


const encoder = new TextEncoder();
const emailBuffer = encoder.encode(email);
const saltBuffer = await crypto.subtle.digest('SHA-256', emailBuffer);
const salt = new Uint8Array(saltBuffer);


const saltedPassword = password + new TextDecoder().decode(salt);
const saltedPasswordBuffer = encoder.encode(saltedPassword);


const hashBuffer = await crypto.subtle.digest('SHA-256', saltedPasswordBuffer);
const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

return hashHex;
}


// user singup route 
userrouter.post('/signup', async (c) => {
const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());

const body = await c.req.json();
const {email , password ,name } = body 


if (!body.email || !body.password) {
    return c.json({ error: 'Email and password are required' }, 400);
}

try {
    const existingUser = await prisma.user.findUnique({
        where: { email },
        });
    
        if (existingUser) {
        return c.json({ error: "Email already exists" });
        }

    const password = await hashPassword(body.password ,body.email);
    console.log(`Hashed password for signup: ${password}`);

    
    const user = await prisma.user.create({
    data: {
        email,
        password: password,
        name,
    }
    });


    console.log("User ID:", user.id)
    const jwttokken = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt: jwttokken });
} catch (e) {
    console.error('Error during signup:', e);  
    c.status(500);
    return c.json({ error: "Error while signing up" });
}
});

// signin route
userrouter.post('/signin', async (c) => {
const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
}).$extends(withAccelerate());

const body = await c.req.json();

if (!body.email || !body.password) {
    return c.json({ error: 'Email and password are required' }, 400);
}

try {
    
    const hashedPassword = await hashPassword(body.password ,body.email);
    console.log(`Hashed password for signin: ${hashedPassword}`);  


    const user = await prisma.user.findFirst({
    where: {
        email: body.email,
        password: hashedPassword,  
    }
    });

    if (!user) {
    c.status(403);
    return c.json({ error: "User not found or incorrect password" });
    }

    const jwttokken = await sign({ id: user.id }, c.env.JWT_SECRET);
    
    
    return c.json({ jwt: jwttokken });
} catch (e) {
    console.error('Error during signin:', e);  
    c.status(500);
    return c.json({ error: "Error while signing in" });
}
});