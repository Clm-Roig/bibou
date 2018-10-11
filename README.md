# Bibou

Nourrice virtuelle pour enfants (Alexa).

## Installation

- installer ask cli (https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html).
- Créer un skill (https://developer.amazon.com/alexa/console/ask).
- Créer une fonction lambda, ajoutez comme déclencheur Alexa skill kit (https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions).
- Dans l'onglet endpoint de votre skill renseignez l'ARN de votre fonction lambda, sauvegardez l'endpoint.

`$ ask clone`

- Selectionner le skill que vous venez de créer.
- Clone le repo.
- Deplacer le dossier .ask du skill que vous venez de cloner vers la racine du dossier du repo.

`$ ask deploy`
