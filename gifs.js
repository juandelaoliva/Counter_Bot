function getRandomGif() {
    return gifs[Math.floor(Math.random() * Math.floor(gifs.length - 1))];
}


function getRandomSentence() {
    return frases[Math.floor(Math.random() * Math.floor(frases.length - 1))];
}


var gifs = [
    "https://media.giphy.com/media/R9cQo06nQBpRe/giphy.gif",
    "https://media.giphy.com/media/tfwj5xK0G7fTa/giphy.gif",
    "https://media.giphy.com/media/bnlhH7EnbAxhK/giphy.gif",
    "https://media.giphy.com/media/d3jucsD2xP63S/giphy.gif",
    "https://media.giphy.com/media/kDsjinzVzi1Ko/giphy.gif",
    "https://media.giphy.com/media/9D8DzhgszarNBqITFv/giphy.gif",
    "https://media.giphy.com/media/bnlhH7EnbAxhK/giphy.gif",
    "https://media.giphy.com/media/T5S2baHKApwgE/giphy.gif",
    "https://media.giphy.com/media/dwThVyfWthesU/giphy.gif",
    "https://media.giphy.com/media/sO5eDV8ZBXERO/giphy.gif",
    "https://media.giphy.com/media/13bMnBRJ55TiJq/giphy.gif",
    "https://media.giphy.com/media/l4FGofz1GEVRuUnZu/giphy.gif",
    "https://media.giphy.com/media/L4c14CNA9TR6w/giphy.gif",
    "https://media.giphy.com/media/12FhcHXEAA4BKE/giphy.gif",
    "https://media.giphy.com/media/l0HlyixNov8PC3Mo8/giphy.gif",
    "https://media.giphy.com/media/YP7ZrMEgl9ep96KnfD/giphy.gif",
    "https://media.giphy.com/media/26gJye0inn0ntSLew/giphy.gif",
    "https://media.giphy.com/media/l0MYOZYMTOLZU1GQE/giphy.gif",
    "https://media.giphy.com/media/xW2X5imcGBB1QjFYfA/giphy.gif",
    "https://media.giphy.com/media/D7hfPlnFq4As8/giphy.gif",
    "https://media.giphy.com/media/l1J3wtkFFTUNoZknC/giphy.gif",
    "https://media.giphy.com/media/vU4iZrQyK5w6k/giphy.gif",
    "https://media.giphy.com/media/IcifS1qG3YFlS/giphy.gif",
    "https://media.giphy.com/media/3owzW6Kkpifjuv9gDC/giphy.gif",
    "https://media.giphy.com/media/9muUXOtrd5gpG/giphy.gif",
    "https://media.giphy.com/media/dZjjgXrVcEKWjblOU8/giphy.gif",
    "https://media.giphy.com/media/WMrNBVGsE4io8/giphy.gif",
    "https://media.giphy.com/media/GMdrPHmlNgsaQ/giphy.gif",
    "https://media.giphy.com/media/26gJzZ42vXY6eimLS/giphy.gif",
    "https://media.giphy.com/media/Qa6aPhf1gD4Bi/giphy.gif",
    "https://media.giphy.com/media/3oEduZqr2b3f7AG6aI/giphy.gif",
    "https://media.giphy.com/media/3oKGzqWSm6WBIUM30Q/giphy.gif",
    "https://media.giphy.com/media/26uf10GWGaKqhD9Is/giphy.gif",
    "https://media.giphy.com/media/L4c14CNA9TR6w/giphy.gif",
    "https://media.giphy.com/media/L4c14CNA9TR6w/giphy.gif",
    "https://media.giphy.com/media/L4c14CNA9TR6w/giphy.gif",
    "https://media.giphy.com/media/L4c14CNA9TR6w/giphy.gif"
];

var frases = [
    "Voy a cagar",
    "Voy a echar la nutria al rio",
    "Voy a hundir un zeppelín",
    "Voy a plantar un pino",
    "Voy a esculpir un cilindro",
    "Voy a lanzar un misil",
    "Voy a ensuciar la porcelana",
    "Voy a cambiarle el agua a las albóndigas",
    "Voy al trono",
    "Voy a tirarle el puro al cachetón",
    "El perrete me asoma el ocico",
    "Voy a defecar",
    "Voy a hacer un pastel",
    "Voy a dar a luz",
    "Voy a mear duro",
    "Me esta viniendo la inspiración",
    "Voy a soltar el ancla",
    "¡Hombre al agua!",
    "Voy al confesionario",
    "Voy a dejarte unos lodos",
    "Voy a echar un tronco",
    "Voy a pintar abstracto en papel suave",
    "Voy a calcular mi producto interior bruto",
    "Voy a echar un cake",
    "Voy a desalojar al inquilino",
    "Voy a echar un topo",
    "Voy a echar un mojón",
    "Voy a liberara  la bestia",
    "Voy a tirar la basura",
    "Voy a liberar a Willy",
    "Voy a descomer",
    "Voy a hacer popo",
    "Voy a sacar la leña al patio",
    "Voy a hacer algo que no puedes hacer por mi",
    "Voy a derivar el pan integral",
    "Voy a hacer mierda",
    "Voy a sacar lo mejor de mi mismo",
    "Voy a excretar",
    "Voy a abonar",
    "Voy a despejar una incógnita",
    "Voy a echar un pulso",
    "Voy a liberar a los rehenes",
    "Voy a pasar de lo abstracto a lo concreto",
    "Voy a sacar el mal que llevo dentro",
    "Voy a evacuar una duda",
    "Voy a sacarme un peso de encima",
    "Voy a tener un momento All Bran",
    "Voy a arrugar la cara",
    "Voy a hacer unos adobes",
    "Voy a salpicar los cachetes",
    "Voy a columpiar el tamarindo",
    "Voy a reciclar material biodegradable",
    "Voy a ponerle sabor al caldo",
    "Voy a chicago",
    "Voy a expulsar el mal",
    "Voy a devolverle a la naturaleza lo que es suyo",
    "Voy a hacer abdominales sentado",
    "Voy a chocolatar la taza",
    "Voy a liberar a Nelson Mandela",
    "Voy a parir un mulato",
    "Voy al aseo",
    "Voy a dar un regalo",
    "Voy a escribir una carta",
    "¿Quieres adoptar un negrito?",
    "Voy a descargar",
    "Voy a despedir al empleado",
    "El muñeco se asoma",
    "Voy al tocador",
    "Voy a echar la pesa",
    "Voy a arrancar la moto",
    "Siento la llamada de la naturaleza",
    "Voy a pasear al Pokemón",
    "Se me salió la duda",
    "Surgio un improvisto",
    "Voy a crear vida",
    "Voy a soltar lastre",
    "Voy a hacer unas deposiciónes",
    "Voy a poner un huevo",
    "Voy a mandar un fax",
    "Voy a recrear la caza del octubre rojo",
    "Voy a echar un meo y de paso me la veo",
    "Voy a hacer los deberes",
    "Voy a ver el remolino",
    "Voy a reiniciar windows",
    "Voy a sacar un trén del túnel",
    "Voy a oir cantar al chato",
    "Voy a quitarme un peso de encima",
    "Me voy en privado",
    "Voy a crear heces fecales",
    "Voy a entregar unos bombónes",
    "Voy a despedir a un amigo del interior",
    "Voy a echar una boya",
    "Voy a echar un topo al remolino",
    "Voy a externar mi malestar",
    "Voy a leer al baño",
    "Voy a negociar una liberación",
    "Tengo un asunto que atender",
    "Voy a crear vida",
    "Voy a sacar el halcón milenario",
    "Voy a echar el miedo"
]


module.exports = {
    getRandomGif,
    getRandomSentence
}