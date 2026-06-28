import {

  Cormorant_Garamond,

  Inter,

  Playfair_Display,

  Poppins,

} from "next/font/google";



const inter = Inter({

  subsets: ["latin"],

  display: "swap",

  variable: "--font-inter",

});



const playfair = Playfair_Display({

  subsets: ["latin"],

  display: "swap",

  variable: "--font-serif",

});



const cormorant = Cormorant_Garamond({

  subsets: ["latin"],

  display: "swap",

  variable: "--font-heading",

});



const poppins = Poppins({

  subsets: ["latin"],

  weight: ["400", "500", "600"],

  display: "swap",

  variable: "--font-poppins",

});



export const siteFonts = {

  inter,

  playfair,

  cormorant,

  poppins,

  className: `${inter.variable} ${playfair.variable} ${cormorant.variable} ${poppins.variable}`,

};


