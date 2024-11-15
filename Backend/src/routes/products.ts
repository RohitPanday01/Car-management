import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate} from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { jwtMiddleware } from "../middleware";


export const productrouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string;
	}
	Variables: {
		userId: number; 
	  };
}>();

// productrouter.use(async (c, next) => {
// 	const authHeader = c.req.header("Authorization") || "";
// 	try {
// 		const user = await verify(authHeader, c.env.JWT_SECRET);
// 		console.log(user)
// 		if (user) {
// 			c.set("userId", user.id as number);
// 			await next();
// 		} else {
// 			c.status(403);
// 			return c.json({
// 				message: "You are not logged in"
// 			})
// 		}
// 	} catch(e) {
// 		c.status(403);
// 		return c.json({
// 			message: "You are not logged in"
// 		})
// 	}
//   });
// create 
  productrouter.post('/add' ,jwtMiddleware, async(c)=>{
	const userId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { title, description, carTypeName, companyName, dealerName, images } = await c.req.json();

  if (images.length > 10) {
    return c.json({ error: 'Up to 10 images allowed' }, 400);
  }

  let carType = await prisma.carType.findUnique({
    where: { name: carTypeName },
  });
  if (!carType) {
    carType = await prisma.carType.create({
      data: { name: carTypeName },
    });
  }

  let company = await prisma.company.findUnique({
    where: { name: companyName },
  });
  if (!company) {
    company = await prisma.company.create({
      data: { name: companyName },
    });
  }

  let dealer = await prisma.dealer.findUnique({
    where: { name: dealerName },
  });
  if (!dealer) {
    dealer = await prisma.dealer.create({
      data: { name: dealerName },
    });
  }

  const car = await prisma.car.create({
    data: {
      title,
      description,
      carTypeId: carType.id,
      companyId: company.id,
      dealerId: dealer.id,
      userId,
      images: {
        create: images.map((url: string) => ({ url })),
      },
    },
    include: { images: true },
  });

  return c.json(car);

  })

  //search

productrouter.get('/my-cars',jwtMiddleware, async (c)=> {
	const prisma = new PrismaClient({
		datasourceUrl:c.env.DATABASE_URL
	   }).$extends(withAccelerate())
	const userId = c.get('userId')

	try{
		const products = await prisma.car.findMany({
			where :{
				userId
			},
			include:{ images:true , carType:true , dealer:true , company:true }
			
		})
		console.log(products)
		return c.json(products);
	
	} catch (error) {
		return c.json({ error: "Failed to retrieve cars" }, 500);
	  }


})

// search based on title or discription or cartype or dealer or company from search bar  
productrouter.get('/search',jwtMiddleware ,async (c)=> {
	const prisma = new PrismaClient({
		datasourceUrl:c.env.DATABASE_URL
	   }).$extends(withAccelerate())
	   const userId = c.get('userId');
	   const keyword = c.req.query('keyword') || '';
   
	   const cars = await prisma.car.findMany({
		   where: {
			   userId: userId,
			   OR: [
				   { title: { contains: keyword, mode: 'insensitive' } },
				   { description: { contains: keyword, mode: 'insensitive' } },
				   {
					   carType: {
						   name: { contains: keyword, mode: 'insensitive' }
					   }
				   },
				   {
					   dealer: {
						   name: { contains: keyword, mode: 'insensitive' }
					   }
				   },
				   {
					   company: {
						   name: { contains: keyword, mode: 'insensitive' }
					   }
				   }
			   ]
		   },
		   include: {
			   images: true,
			   carType: true,
			   company: true,
			   dealer: true
		   }
	   });
   
	   return c.json(cars);

})

// update

productrouter.put('/:id' ,jwtMiddleware, async (c)=>{ 
	const prisma = new PrismaClient({
		datasourceUrl:c.env.DATABASE_URL
	   }).$extends(withAccelerate())
	   const carId = parseInt(c.req.param("id"), 10);
	   const userId = c.get('userId');
	 
	   const { title, description, carTypeName, companyName, dealerName, images } = await c.req.json();
	   const data: any = {};
	 
		
	   if (title) data.title = title;
	   if (description) data.description = description;
	 
	   if (carTypeName) {
		 let carType = await prisma.carType.findUnique({
		   where: { name: carTypeName },
		 });
		 if (!carType) {
		   carType = await prisma.carType.create({
			 data: { name: carTypeName },
		   });
		 }
		 data.carTypeId = carType.id;
	   }
	 
	   if (companyName) {
		 let company = await prisma.company.findUnique({
		   where: { name: companyName },
		 });
		 if (!company) {
		   company = await prisma.company.create({
			 data: { name: companyName },
		   });
		 }
		 data.companyId = company.id;
	   }
	   if (dealerName) {
		 let dealer = await prisma.dealer.findUnique({
		   where: { name: dealerName },
		 });
		 if (!dealer) {
		   dealer = await prisma.dealer.create({
			 data: { name: dealerName },
		   });
		 }
		 data.dealerId = dealer.id;
	   }
	
	   if (images && images.length > 0) {
		 data.images = {
		   deleteMany: {}, 
		   create: images.map((url: string) => ({ url })), 
		 };
	   }
	 
	   try {
		 const updatedCar = await prisma.car.update({
		   where: {
			 id: carId,
			 userId,
		   },
		   data,
		   include: { images: true },
		 });
	 
		 return c.json(updatedCar);
	   }catch (error) {
		 return c.json({ error: "Car not found or update failed" }, 404);
	   }
})

productrouter.delete('/:id',jwtMiddleware, async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl:c.env.DATABASE_URL
	   }).$extends(withAccelerate())
    const id = parseInt(c.req.param('id'), 10);
    await prisma.car.delete({ where: { id } });
    return c.json({ message: 'Car deleted successfully' });
});


