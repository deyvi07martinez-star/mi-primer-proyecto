export type Shot = { file: string; alt: string; altEn: string };

export type WeddingCase = {
  id: "colonial" | "campo" | "destino";
  shots: Shot[];
};

const shot = (file: string, alt: string, altEn: string): Shot => ({ file, alt, altEn });

export const cases: WeddingCase[] = [
  {
    id: "colonial",
    shots: [
      shot("colonial-01-brindis", "Las damas de honor en pijama descorchan una botella de champán la mañana de la boda", "The bridesmaids in pyjamas open a bottle of champagne on the morning of the wedding"),
      shot("colonial-02-mesa", "Mesa larga del banquete vestida de blanco con centros de rosas y velas", "The long banquet table dressed in white with rose centrepieces and candles"),
      shot("colonial-03-pareja", "Los novios se toman de la mano en el patio de piedra del venue colonial", "The couple hold hands in the stone courtyard of the colonial venue"),
      shot("colonial-04-anillos", "Los anillos de boda y el de compromiso dentro de una cajita rosa de terciopelo", "The wedding bands and engagement ring inside a small pink velvet box"),
      shot("colonial-05-damas", "La novia rodeada de sus damas de honor en vestidos verde salvia con ramos de flores", "The bride surrounded by her bridesmaids in sage dresses holding bouquets"),
      shot("colonial-06-zapatos", "Sandalias blancas de plataforma con lazo, listas sobre la mesa de la novia", "White platform sandals with a bow, waiting on the bride's table"),
      shot("colonial-07-ramo", "Las damas levantan los brazos y celebran alrededor de la novia", "The bridesmaids throw their arms up and cheer around the bride"),
      shot("colonial-08-bizcocho", "Bizcocho de boda de cinco pisos junto a los arcos del patio colonial", "A five-tier wedding cake beside the arches of the colonial courtyard"),
    ],
  },
  {
    id: "campo",
    shots: [
      shot("campo-01-invitaciones", "Invitaciones y tarjetas de colores desplegadas sobre la mesa antes de la ceremonia", "Colourful invitations and cards laid out on the table before the ceremony"),
      shot("campo-02-votos", "El novio de esmoquin blanco escucha a la novia leer sus votos frente al seto", "The groom in a white tuxedo listens to the bride read her vows by the hedge"),
      shot("campo-03-bandeja", "Bandeja de mimbre con los anillos, un cojín bordado y flores silvestres", "A wicker tray holding the rings, an embroidered cushion and wildflowers"),
      shot("campo-04-flores", "Centros de flores silvestres naranjas y amarillas en jarrones de cristal", "Orange and yellow wildflower centrepieces in glass vases"),
      shot("campo-05-lounge", "Zona lounge en el jardín con mesa blanca y un arreglo floral pequeño", "A garden lounge area with a white table and a small floral arrangement"),
      shot("campo-06-ceremonia", "Invitados sentados bajo sombrillas blancas durante la ceremonia al aire libre", "Guests seated under white parasols during the outdoor ceremony"),
      shot("campo-07-regalos", "Mesa de cartas y regalos con el libro de firmas y flores de temporada", "The cards and gifts table with the guest book and seasonal flowers"),
      shot("campo-08-beso", "Los novios se abrazan con el ramo en alto al final de la ceremonia", "The couple embrace with the bouquet held high at the end of the ceremony"),
    ],
  },
  {
    id: "destino",
    shots: [
      shot("destino-01-fiesta", "Invitados con sombreros de la hora loca bailando durante la fiesta", "Guests in party hats dancing during the reception"),
      shot("destino-02-centro", "Centro de mesa alto de paniculata blanca rodeado de velas encendidas", "A tall baby's breath centrepiece surrounded by lit candles"),
      shot("destino-03-baile", "La pareja baila bajo las luces rojas de la pista en plena fiesta", "The couple dance under the red lights of the dance floor"),
      shot("destino-04-barra", "Barra del bar con el menú de cócteles de la boda y un arreglo de rosas blancas", "The bar with the wedding cocktail menu and an arrangement of white roses"),
      shot("destino-05-abrazo", "Los novios se miran de cerca durante el primer baile en el salón de piedra", "The couple look at each other during the first dance in the stone hall"),
    ],
  },
];

/** Todas las tomas, para la tira que corre debajo del hero. */
export const allShots: Shot[] = cases.flatMap((c) => c.shots);

export const heroShot = cases[1].shots[7]; // campo-08-beso
