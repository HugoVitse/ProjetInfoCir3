const express = require('express');
const { ObjectId } = require('mongodb');
const connect_db = require('./connect_db');
const filter_user_entry = require('./filter_user_entry');

const router = express.Router();

const questionnaire =  async (req, res) => {
    const { userId, activities, note, preferredTime, groupSize, placeType, budget, favoriteCuisine, travelDistance, weekendPlans } = req.body;

    // Vérification des entrées
    const verificationInputs = [activities, note, preferredTime, groupSize, placeType, budget, favoriteCuisine, travelDistance, weekendPlans].some(filter_user_entry);
    if (verificationInputs) {
        res.status(504).send("Caractères invalides dans l'une des réponses du questionnaire");
        return;
    }

    const client = await connect_db.client;
    const db = client.db('your_database_name');
    const usersCollection = db.collection('users');

    try {
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    questionnaire: {
                        activities,
                        note,
                        preferredTime,
                        groupSize,
                        placeType,
                        budget,
                        favoriteCuisine,
                        travelDistance,
                        weekendPlans,
                    }
                }
            }
        );

        if (result.matchedCount > 0) {
            res.status(200).send("Questionnaire enregistré avec succès");
        } else {
            res.status(404).send("Utilisateur non trouvé");
        }
    } catch (err) {
        res.status(500).send("Erreur lors de l'enregistrement du questionnaire");
    }
};

module.exports = questionnaire;
