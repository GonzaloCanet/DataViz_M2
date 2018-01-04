//----------------------------------------------------------------
// Auteurs : Renaud, Alice, Mathilde 
// Date : Decembre 2017 
//----------------------------------------------------------------

var depart="LE HAVRE";
var arrivee="STRASBOURG";
var numeroJoueurCourant;
var trajetCourant;
//nombre de div disponible dans la page html
var nombreJoueursMax=3;


//----------------------------------------------------------------
//  initialise le nb de joueurs, toutes données à 0, cache la div formulaire, lance start() 
//----------------------------------------------------------------
function initialisation(){
    // cache la div
    document.getElementById("popup").style.display = "none"; 
    document.getElementById("game").style.opacity="1";

    // garde le bon nombre de div dans la barre de gauche
    var nombreJoueurs=document.getElementById("selectNombreJoueurs").value;
    for(var i=parseInt(nombreJoueurs)+1;i<=nombreJoueursMax;i++){
       document.getElementsByClassName("joueur"+i)[0].style.display="none";
    }

    let p1 = new Promise(function(resolve, reject) {
        // crée les joueurs
        for(var i=1;i<=parseInt(nombreJoueurs);i++){
            var joueur= new Joueur(i,depart);
            joueurs.addJoueur(joueur);
        }
    });

    p1.then(start());

}

//----------------------------------------------------------------
//  init le joueur 1
//----------------------------------------------------------------
function start(){
    document.getElementById("joueur1co2").innerHTML=joueurs.getJoueur(1).co2;
    document.getElementById("joueur1temps").innerHTML=joueurs.getJoueur(1).temps;
    document.getElementById("joueur1prix").innerHTML=joueurs.getJoueur(1).prix;
    afficherCheminsAccessiblesDepuisVille(joueurs.getJoueur(1).position);
    numeroJoueurCourant=1;
}

//----------------------------------------------------------------
//  deux villes a au moins 3 chemins d'écart
//----------------------------------------------------------------
function getDepartArrivee(){
    //TODO
}


//----------------------------------------------------------------
// affiche en direct la ville dans le formulaire de réponse au clique
//----------------------------------------------------------------
function completeformulaire(arriveeSelectionnee){
    document.getElementById("nomVilleChoisie").value=arriveeSelectionnee;

    // si un bouton radio est déjà là, afficher le trajet 
    var radios = document.getElementsByName('moyenTransport');
    for(x = 0; x < radios.length; x++){
       if (radios[x].checked){
           var id=radios[x].id;
            switch(id) {
            case "train":
               completeDataFormTrain();
                break;
            case "avion":
                completeDataFormAvion();
                break;
            case "voiture":
                completeDataFormVoiture();
                break;
            default:
                break;
        }           
       } 
    }
}

//----------------------------------------------------------------
// cherche le trajet en train et appelle afficheTrajet
//----------------------------------------------------------------
function completeDataFormTrain(){
    var depart=joueurs.getJoueur(numeroJoueurCourant).position;
    var arrivee=document.getElementById("nomVilleChoisie").value;
    var trajet=trajets.getTrajetEnTrain(depart,arrivee);
    afficheTrajet(trajet);
}

//----------------------------------------------------------------
// cherche le trajet en voiture et appelle afficheTrajet
//----------------------------------------------------------------
function completeDataFormVoiture(){
    var depart=joueurs.getJoueur(numeroJoueurCourant).position;
    var arrivee=document.getElementById("nomVilleChoisie").value;
    var trajet=trajets.getTrajetEnVoiture(depart,arrivee);
    afficheTrajet(trajet);
}

//----------------------------------------------------------------
// cherche le trajet en avion et appelle afficheTrajet
//----------------------------------------------------------------
function completeDataFormAvion(){
    var depart=joueurs.getJoueur(numeroJoueurCourant).position;
    var arrivee=document.getElementById("nomVilleChoisie").value;
    var trajet=trajets.getTrajetEnAvion(depart,arrivee);
    afficheTrajet(trajet);
}

//----------------------------------------------------------------
// complete co2, temps, prix
//----------------------------------------------------------------
function afficheTrajet(trajet){
    if(trajet==null){
        document.getElementById("trajetco2").innerHTML="";
        document.getElementById("trajetprix").innerHTML="";
        document.getElementById("trajettemps").innerHTML="";
    }
    else{
        document.getElementById("trajetco2").innerHTML=trajet.co2;
        document.getElementById("trajetprix").innerHTML=trajet.prix;
        document.getElementById("trajettemps").innerHTML=trajet.duree;
    }
    trajetCourant=trajet;
}

//----------------------------------------------------------------
//  modifie le score, l'historique du joueur
//----------------------------------------------------------------
function jouer(){
    if(trajetCourant !=undefined){
        joueurs.getJoueur(numeroJoueurCourant).position=document.getElementById("nomVilleChoisie").value;
        joueurs.getJoueur(numeroJoueurCourant).actions.push(trajetCourant);
        joueurs.getJoueur(numeroJoueurCourant).temps=additionHeure(joueurs.getJoueur(numeroJoueurCourant).temps,document.getElementById("trajettemps").innerHTML);
        joueurs.getJoueur(numeroJoueurCourant).prix+=parseFloat(document.getElementById("trajetprix").innerHTML);
        joueurs.getJoueur(numeroJoueurCourant).co2+=parseFloat(document.getElementById("trajetco2").innerHTML);
        suivant(numeroSuivant(numeroJoueurCourant));
    }
}

//----------------------------------------------------------------
// test si arrivee, si non afficherCheminsAccessiblesDepuisVille(ville); si oui test si finished() si oui displayscores() si non suivant(joueur+1)
//----------------------------------------------------------------
function suivant(numeroJoueur){
    console.log(numeroJoueur)
    if(joueurs.getJoueur(numeroJoueur).position!=arrivee){
        numeroJoueurCourant=numeroJoueur;
        retirerCheminsAccessibles();
        //TODO la barre de gauche
        afficherCheminsAccessiblesDepuisVille(joueurs.getJoueur(numeroJoueur).position);
    }
    else{
        if(finished()){
            //TODO
        }
        else{
            suivant(numeroSuivant(numeroJoueur))
        }
    }

}

//----------------------------------------------------------------
// indique que la partie est finie
//----------------------------------------------------------------
function finished(){
    for( i in joueurs.joueurs){
        if(joueurs.getJoueur(i).position!=arrivee){
            return false;
        }
    }
    return true;
}

//----------------------------------------------------------------
// fait l'addition des heures minutes
//----------------------------------------------------------------
function additionHeure(heure1,heure2){
    console.log(heure1)
    var h1=parseInt(heure1.split("h")[0]);
    var h2=parseInt(heure2.split("h")[0]);
    var mins1=parseInt(heure1.split("h")[1]);
    var mins2=parseInt(heure1.split("h")[1]);
    if((mins1+mins2)>60){
        var mins=(mins1+mins2)%60;
        var h=h1+h2+1;
    }
    else{
        var mins=(mins1+mins2);
        var h=h1+h2;
    }
    return h+"h"+mins;
}

//----------------------------------------------------------------
// un modulo un peu spécial pour avoir le numero du joueur suivant
//----------------------------------------------------------------
function numeroSuivant(num) {
    if((num+1)%(joueurs.joueurs.length-1) == 0){
        return joueurs.joueurs.length-1;
    }
    else {
        return (num+1)%(joueurs.joueurs.length-1) ;
    }
}