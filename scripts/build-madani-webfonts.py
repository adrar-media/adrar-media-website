#!/usr/bin/env python3
"""
FABRICATION DES WEBFONTS MADANI ARABIC

    python3 scripts/build-madani-webfonts.py [dossier_des_otf]

Produit `public/fonts/madani-arabic-{thin,regular,bold,black}.woff2` à partir
des OTF fournis par la fonderie. Les fichiers produits sont versionnés : ce
script sert à les refaire le jour où la police est mise à jour ou remplacée par
sa version sous licence complète, pas à chaque build.

Deux choses s'y jouent.

1. CONVERSION EN WOFF2

   Les OTF pèsent environ 410 Ko pièce, les WOFF2 environ 55 Ko. Aucun
   navigateur cible ne nécessite un autre format ; on ne produit donc que
   celui-là.

2. RETRAIT DES CHIFFRES

   Dans la version DEMO, la fonderie a neutralisé les chiffres : les dix
   chiffres latins, les dix chiffres arabo-indiens et les dix chiffres
   arabo-indiens étendus pointent tous vers le même dessin de remplissage
   hachuré, un rectangle rayé. Utilisée telle quelle, la police afficherait
   « 516K+ » sous la forme de trois pavés rayés suivis de « K+ ».

   On retire donc ces trente caractères de la table de correspondance. Le
   navigateur les cherche alors dans la police suivante de la pile — Readex Pro
   — et affiche de vrais chiffres. Les dessins hachurés restent dans le fichier
   mais ne sont plus atteignables ; les retirer vraiment supposerait de
   recalculer les tables de substitution, pour une économie de quelques
   kilo-octets.

   Le jour où la version sous licence remplace la DEMO, ce retrait n'aura plus
   lieu d'être : passer PLACEHOLDER_DIGITS à un ensemble vide et relancer.

Dépendances (hors du projet, à installer ponctuellement) :

    pip install fonttools brotli
"""

import os
import sys

from fontTools.ttLib import TTFont

# Chiffres latins, arabo-indiens et arabo-indiens étendus.
PLACEHOLDER_DIGITS = set(range(0x30, 0x3A)) | set(range(0x660, 0x66A)) | set(
    range(0x6F0, 0x6FA)
)

WEIGHTS = [("Thin", "thin"), ("Regular", "regular"), ("Bold", "bold"), ("Black", "black")]

DEFAULT_SOURCE = os.path.expanduser("~/Downloads/madani-arabic-demo")
DESTINATION = os.path.join(os.path.dirname(__file__), "..", "public", "fonts")


def build(source: str, destination: str) -> None:
    os.makedirs(destination, exist_ok=True)

    for name, slug in WEIGHTS:
        origin = os.path.join(source, f"MadaniArabicDEMO-{name}.otf")
        if not os.path.exists(origin):
            sys.exit(f"Fichier source introuvable : {origin}")

        font = TTFont(origin)

        removed = 0
        for table in font["cmap"].tables:
            for codepoint in list(table.cmap):
                if codepoint in PLACEHOLDER_DIGITS:
                    del table.cmap[codepoint]
                    removed += 1

        font.flavor = "woff2"
        target = os.path.join(destination, f"madani-arabic-{slug}.woff2")
        font.save(target)

        print(
            f"{slug:8} {os.path.getsize(origin) / 1024:6.0f} Ko otf → "
            f"{os.path.getsize(target) / 1024:5.0f} Ko woff2 "
            f"({removed} correspondances de chiffres retirées)"
        )


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SOURCE, DESTINATION)
