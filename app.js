const playerselector = document.querySelector('#readDB');
const form = document.querySelector('#add-player-form');

// créé un élément et obtenir les joueurs
function getPlayer(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let club = document.createElement('span');
    let trophies = document.createElement('span');
    let age = document.createElement('span');
    let cross = document.createElement('div'); //pour supprimer un élément

    li.setAttribute('data-id', doc.id); //attribut à la liste l'id du document de firestore
    name.textContent = doc.data().name;
    club.textContent = doc.data().club;
    trophies.textContent = doc.data().trophies;
    age.textContent = doc.data().age;
    cross.textContent = 'x'; //pour supprimer un élément

    li.appendChild(name);
    li.appendChild(club);
    li.appendChild(trophies);
    li.appendChild(age);
    li.appendChild(cross); //pour supprimer un élément


    playerselector.appendChild(li);

    //supprime avec la croix (cross)
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id'); //prend l'id du doc dans la li 
        db.collection('player-list').doc(id).delete(); //supprime uniquement un document 
    })
}

// affichage des data en real-time
db.collection('player-list').orderBy('trophies').onSnapshot(snapshot => { 

    //On aurait pu prend spécifiée notre querie en ajoutant la méthode where(). 
    //Par ex : db.collection('player-list').where("club", "==", "madrid").get().then(...
    //Possibilité de spécifier l'ordre des data dans la list en utilisant orderBy() 
    //(ici ordré par nombre de trophées décroissants)
    
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        //ecoute les changements, affiche les ajouts et n'affiche pas les éléments supprimés
        if (change.type == 'added'){ 
            getPlayer(change.doc);
        } 
        else if (change.type == 'removed'){
            let li = playerselector.querySelector('[data-id =' + change.doc.id + ']'); 
            playerselector.removeChild(li);
        }
    });
    
    
});

// entrée de data dans la DB

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('player-list').add({
        name: form.name.value,
        club: form.club.value,
        age: form.age.value,
        trophies: form.trophies.value
    });
    form.name.value = '';
    form.club.value = '';
    form.age.value = '';
    form.trophies.value = '';
});