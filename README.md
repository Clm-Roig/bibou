# Bibou

Nourrice virtuelle pour enfants (Alexa).

## Installation

- Installer ask cli (https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html). Suivre la procédure jusqu'au bout (commande *ask init* notamment).
- Créer un skill (https://developer.amazon.com/alexa/console/ask).
- Créer une fonction lambda, ajoutez comme déclencheur Alexa skill kit (https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions).
**Nom du lambda :** bibou-lambda
**Région du lambda :** Virginie du Nord
- Dans l'onglet endpoint de votre skill renseignez l'ARN de votre fonction lambda, sauvegardez l'endpoint.
- Exécuter :
`$ ask clone`
- Selectionner le skill que vous venez de créer --> le skill + lambda sont clonés. 
- Deplacer le dossier .ask du skill que vous venez de cloner vers la racine du dossier du repo git. Il contient le fichier *config* qui permettra de spécifier quel skill et lambda vous voulez utiliser (les vôtres en l'occurrence). 
- Une fois le fichier .ask/config déplacé dans le répo git, supprimer tout ce que vous venez de créer avec *ask clone*. 
- Se placer dans le répo git et exécuter :
`$ ask deploy`
