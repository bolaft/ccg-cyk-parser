Analyseur de grammaire catégorielle (algo CYK)
==============================================

## Sujet 5

Définir un analyseur de grammaire catégorielle classique (avec les deux règles classiques) utilisant une méthode tabulaire (algorithme CYK). Le programme devra indiquer si une chaîne en entrée est analysable avec la
grammaire et si oui, devra donner au moins une dérivation. 

**Travail facultatif :** le programme affichera une ou toutes les dérivations sous forme graphique.

## Installation

Aucune installation n'est nécessaire. Pour faire fonctionner l'application en local, il suffit d'ouvrir le fichier index.html dans un navigateur. Il est possible d'utiliser l'application en ligne sans télécharger quoi que ce soit en se rendant à l'adresse [nsal.im/CYK](http://nsal.im/CYK/). 

## Prérequis

Le javascript doit être activé pour que l'application fonctionne. La page a été testée avec Chrome et Firefox ; elle devrait fonctionner normalement avec d'autres navigateurs modernes.

## Utilisation

Rentrer les différentes règles de la grammaire dans la première zone de texte, au format "[mot]: [forme]". Une seule règle par ligne, sans espace avant ou après. Par exemple :

```
Pierre: SN
donne: ((SN\S)/GP)/SN
une: SN/N
pomme: N
à: GP/SN
Marie: SN
```

Ensuite, il suffit d'entrer une phrase contenant des mots du lexique (et uniquement des mots du lexique) séparés par des espaces et de presser le bouton "Analyser" pour que l'animation se mette en route.

## Lecture

Les cases se colorient en bleu lorsque l'algorithme cherche à leur attribuer une valeur; les paires de cases se colorient en gris lorsque l'algorithme cherche si il peut appliquer l'une des deux règles; et les cases se colorient en vert lorsqu'une dérivation a été trouvée.
