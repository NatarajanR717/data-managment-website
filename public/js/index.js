

$("#adduser").submit(function(event){
   alert("Data inserted successfully!!!");
})

$("#updateuser").submit(function(event){
   event.preventDefault();
   var unindexed_array = $(this).serializeArray();
   var data ={};

   $.map(unindexed_array,function(n,i){
      data[n['name']]=n['value'];
   })
   console.log(data);
   
   var request = {
      "url" : `http://localhost:8080/api/users/${data.id}`,
      "method" : "PUT",
      "data" : data
  }

  $.ajax(request).done(function(response){
      alert("Data Updated Successfully!");
  })
})


if(window.location.pathname == "/"){
   $ondelete = $(".table tbody td a.delete");
   $ondelete.click(function(){
       var id = $(this).attr("data-id")

       var request = {
           "url" : `http://localhost:8080/api/users/${id}`,
           "method" : "DELETE"
       }

       if(confirm("Do you really want to delete this record?")){
           $.ajax(request).done(function(response){
               alert("Data Deleted Successfully!");
               location.reload();
           })
       }

   })
}


// Pagination

const tbody = document.getElementById("tbody");
const pageUi = document.querySelector(".pagination");
const itemShow = document.querySelector("#itemperpage");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
var tr = tbody.querySelectorAll("tr");
var emptyBox = [];
var index = 1;
var itemParpage = 4;
 
for(let i =0;i<tr.length;i++){
   emptyBox.push(tr[i]);
}

prev.addEventListener('click',(e)=>{
   e.preventDefault();
})
next.addEventListener('click',(e)=>{
   e.preventDefault();
})

itemShow.onchange = giveTrPerPage;

function giveTrPerPage(){
   itemParpage = Number(this.value);
   displayPage(itemParpage);
   pageGenerator(itemParpage);
}
function displayPage(limit){
   tbody.innerHTML = "";
   for(let i=0; i<limit;i++){
      tbody.appendChild(emptyBox[i]);
   }
   const pageNum = pageUi.querySelectorAll('.list');
   pageNum.forEach(n=>n.remove());
}
displayPage(itemParpage);

function pageGenerator(getem){
   const num_of_tr = emptyBox.length;
   if(num_of_tr <= getem){
      pageUi.style.display = 'none';
   }
   else{
      pageUi.style.display ='flex';
      const num_of_page = Math.ceil(num_of_tr/getem);
      for(let i =1;i<=num_of_page; i++){
         const li =document.createElement('li');
         li.className ="list";
         const a =document.createElement('a');
         a.href ='#';
         a.innerText= i;
         a.setAttribute('data-page',i);
         li.appendChild(a);
         pageUi.insertBefore(li, pageUi.querySelector('.next'));

      }
   }
}
pageGenerator(itemParpage);


let pageLink = pageUi.querySelectorAll('a');
let lastPage = pageLink.length -2;

function pageRunner(page,items,lastPage,active){
   for(button of page){
      button.onclick = e=>{
         const page_num = e.target.getAttribute('data-page');
         const page_mover = e.target.getAttribute('id');
         if(page_num != null){
            index = page_num;
         }else{
            if(page_mover === 'next'){
               index++;
               if(index >= lastPage){
                  index = lastPage;
               }
            }else{
               index --;
               if(index <=1){
                  index =1;
               }
            }
         }
         pageMaker(index,items,active);
      }
   }
}

var pageLi = pageUi.querySelectorAll('.list');
pageLi[0].classList.add('active');
pageRunner(pageLink,itemParpage,lastPage,pageLi);

function pageMaker(index,item_per_page,active_page){
   const start = item_per_page * index;
   const end = start+item_per_page;
   const current_page = emptyBox.slice((start -item_per_page),(end - item_per_page));
   tbody.innerHTML ='';
   for(let i =0;i<current_page.length;i++){
      let item = current_page[i];
      tbody.appendChild(item);
   }
   Array.from(active_page).forEach((e) =>{
      e.classList.remove('active');
   });
   active_page[index -1].classList.add("active");
}