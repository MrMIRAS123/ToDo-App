const New_Task = document.querySelector("#Add_Task");
const New_Task_Button = document.querySelector("#Add_Task_Button");
var Task_Count = 0;
const Selected_Item = [];
let Task_Limit = 5;
var Task_objectes = [];



//__________________________________________




//_______________________enable button

let Can_Work;

function Enable_Button() {
    const Completer = document.querySelector('#Completer');
    const Activer = document.querySelector('#Activer');
    const All_Task_Item = document.querySelectorAll("#Tsks li");

    // بررسی اینکه حداقل یکی کلاس _select داره
    let atLeastOneSelected = false;
    for (const item of All_Task_Item) {
        if (item.classList.contains("_select")) {
            atLeastOneSelected = true;
            Can_Work = true;
            break;
        }
    }

    if (atLeastOneSelected) {
        Completer.style.background = "#6c63ff";
        Completer.style.cursor = "pointer";
        Activer.style.background = "#6c63ff";
        Activer.style.cursor = "pointer";
        console.log("✅ حداقل یکی انتخاب شده — دکمه‌ها روشن.");
        Activer.disabled = false;
        Completer.disabled = false;
    } else {
        Completer.style.background = "#8c88d4";
        Completer.style.cursor = "default";
        Activer.style.background = "#8c88d4";
        Activer.style.cursor = "default";
        console.log("❌ هیچ آیتمی انتخاب نشده — دکمه‌ها خاموش.");
        Activer.disabled = true;
        Completer.disabled = true;
    }
};




//_____________________________________________________________Local Storage Function


//Set To storage

function Set_Storage() {
    localStorage.setItem('_Tasks_List', JSON.stringify(Task_objectes));
}






//______________________________________________________________________________________________
class createTaskEl {

    Task_ob;

    constructor(Task_ob) {
        this.Task_ob = Task_ob;
    };

    Main_F() {
        //_____________ Dom Add Method


        const Task_L = document.querySelector("#Tsks");

        const Task_Item = document.createElement("li");
        const Task_Name = document.createElement('p');
        const Task_btn = document.createElement('button');

        Task_Name.textContent = this.Task_ob.t_name;
        Task_btn.textContent = "Delete";
        Task_btn.classList.add(`BBtn_${this.Task_ob.t_id}`);
        Task_Item.classList.add(`li_${this.Task_ob.t_id}`);


        Task_objectes.push(this.Task_ob);
        Set_Storage();



        //_________________ Delet Method



        Task_btn.addEventListener('click', () => {
            Task_Item.remove();
            Task_objectes = Task_objectes.filter(t => t.t_id !== this.Task_ob.t_id);
            Set_Storage();
        });



        //_____________________________ Hover Method


        let Is_Select = false;
        let Can_Hover = true;
        Task_Item.addEventListener('mouseover', () => {
            if (Is_Select === false && Can_Hover) {
                Task_Item.style.background = "#c7c1c1";
                Task_Item.style.transform = "translateX(10px)";
                Task_Item.style.transition = "0.7s";
            };
        });

        Task_Item.addEventListener('mouseout', () => {
            if (Is_Select === false && Can_Hover) {
                Task_Item.style.background = "#f9f9f9";
                Task_Item.style.transform = "translateX(0px)";
                Task_Item.style.transition = "0.5s";
            };
        });



        //________________________ Select Method


        Task_Item.addEventListener('click', () => {
            if (Is_Select === false) {
                Is_Select = true;
                Task_Item.style.background = ' #8bdbb6';
                Task_Item.style.transform = "translateX(12px)";
                Task_Item.style.transition = "1s";
                Task_Item.classList.add("_select");
                Selected_Item.push(Task_Item);

            } else {
                Is_Select = false;
                Task_Item.style.background = "#f9f9f9";
                Task_Item.style.transform = "translateX(0px)";
                Task_Item.style.transition = "1s"
                Task_Item.classList.remove("_select");

                const index = Selected_Item.indexOf(Task_Item);
                if (index !== -1) {
                    Selected_Item.splice(index, 1);
                };

            };
            Enable_Button();
        });




        //________________________________ Pervius Status


        if (this.Task_ob.t_status === '_Active') {
            Task_Item.classList.add('_Active');
            // Task_Item.style.background = "#8bdbb6";

            // Can_Hover = false;
        } else if (this.Task_ob.t_status === '_Completed') {
            Task_Item.classList.add('_Completed');
            //Task_Item.style.background = "#ccc";

            //Can_Hover = false;
        }



        //_____________________________ Child Append


        Task_Item.appendChild(Task_Name);
        Task_Item.appendChild(Task_btn);
        Task_L.appendChild(Task_Item);

    };



}




function Task_Adder() {
    if (New_Task.value.length != 0) {

        Task_Count++;
        New_t_ob = {
            t_name: New_Task.value.trim(),
            t_id: Task_Count,
            t_status: '_none'
        };

        const M_Task = new createTaskEl(New_t_ob);
        M_Task.Main_F();


    }
    else {
        New_Task.setAttribute('placeholder', ' Theres Nothing To Add !! ');
        setTimeout(() => {
            New_Task.setAttribute('placeholder', ' Add Your Task ');
        }, 2000);
    };


};




document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && New_Task.value.length > 0) {
        Task_Adder();
        e.preventDefault();
        New_Task.value = "";
    }
})
New_Task_Button.addEventListener("click", () => {
    Task_Adder();
    New_Task.value = "";
});


//_____________________ ______________________________________________Filter Action

const Filtered_li = document.querySelector("#filter_list");






//____________________________

const f_cmp_b = document.querySelector("#cmp");
const f_act_b = document.querySelector('#act');
const f_all_b = document.querySelector('#all');

is_c = false;
is_a = false;
is_ac = false;

let filtered_Task_Name = [];

function findCategory(Cn, Bn) {
    Lstorage = JSON.parse(localStorage.getItem('_Tasks_List'));

    filtered_Task_Name = [];
    //________________ Delet Previus item


    const all_li = document.querySelectorAll('#filter_list li');



    all_li.forEach(L => {
        if (!L.classList.contains(Cn)) {
            Filtered_li.removeChild(L);
        };
    });


    //________ Create Dom
    Lstorage.forEach(curV => {


        if (curV.t_status === Cn && !filtered_Task_Name.includes(curV.t_name)) {
            console.log(curV);

            const fill_Item = document.createElement("li");
            const fill_Name = document.createElement('p');
            const fill_delb = document.createElement('button');

            fill_Name.textContent = curV.t_name;
            fill_delb.textContent = 'Remove';
            filtered_Task_Name.push(curV.t_name);

            fill_Item.classList.add(Cn);

            fill_Item.appendChild(fill_Name);
            fill_Item.appendChild(fill_delb);
            Filtered_li.appendChild(fill_Item);


            //________________Delet an item from list

            fill_delb.addEventListener('click', () => {

                fill_Item.remove();
                curV.t_status = '_none';


                const taskMainItem = document.querySelector(`.li_${curV.t_id}`);
                if (taskMainItem) {
                    taskMainItem.classList.remove('_Active', '_Completed');
                };


                const index = filtered_Task_Name.indexOf(curV.t_name);
                if (index !== -1) {
                    filtered_Task_Name.splice(index, 1);
                };
                localStorage.setItem('_Tasks_List', JSON.stringify(Lstorage));
            });



            //_____________________________________


        } else {
            console.log(` this Item   "   ${curV.t_name}   "   is arleady in list ! `);

        };



    });

    //____________All Tag Filter

    if (Cn === "_All") {

        Lstorage.forEach(curV => {
            if (!filtered_Task_Name.includes(curV.t_name) && curV.t_status != '_none') {
                console.log(curV);

                const fill_Item = document.createElement("li");
                const fill_Name = document.createElement('p');
                const fill_delb = document.createElement('button');

                fill_Name.textContent = curV.t_name;
                fill_delb.textContent = 'Remove';
                filtered_Task_Name.push(curV.t_name);

                fill_Item.classList.add(Cn);

                fill_Item.appendChild(fill_Name);
                fill_Item.appendChild(fill_delb);
                Filtered_li.appendChild(fill_Item);


                //________________Delet an item from list

                fill_delb.addEventListener('click', () => {

                    fill_Item.remove();
                    curV.t_status = '_none';


                    const taskMainItem = document.querySelector(`.li_${curV.t_id}`);
                    if (taskMainItem) {
                        taskMainItem.classList.remove('_Active', '_Completed');
                    };


                    const index = filtered_Task_Name.indexOf(curV.t_name);
                    if (index !== -1) {
                        filtered_Task_Name.splice(index, 1);
                    };
                    localStorage.setItem('_Tasks_List', JSON.stringify(Lstorage));
                });



                //_____________________________________


            } else {
                console.log(` this Item   "   ${curV.t_name}   "   is arleady in list ! `);

            };

        });


    };

    //___________change the button style

    if (Bn === "active_button") {
        is_ac = true;
        is_c = false;
        is_a = false;

        f_all_b.classList.remove('f_button_s');
        f_cmp_b.classList.remove('f_button_s');
        f_act_b.classList.add('f_button_s');
    }
    if (Bn === "complete_button") {
        is_ac = false;
        is_c = true;
        is_a = false;

        f_act_b.classList.remove('f_button_s');
        f_all_b.classList.remove('f_button_s');
        f_cmp_b.classList.add('f_button_s');
    }
    if (Bn === "All_button") {
        is_ac = false;
        is_c = false;
        is_a = true;

        f_act_b.classList.remove('f_button_s');
        f_cmp_b.classList.remove('f_button_s');
        f_all_b.classList.add('f_button_s');
    }

};

//________________________________________________


let is_Act_Run;

//------Active Part

let Actives_Task = [];

let f_list_len = 0
function Sort_Filter_Active() {

    is_Act_Run = true;


    for (let t = 0; t < Selected_Item.length; t++) {
        f_list_len++

        let content = Selected_Item[t];
        content.classList.remove("_Active", "_Completed");
        content.classList.add("_Active");



        //________Local Storage Set
        Class_id = content.classList[0];
        o_id = parseInt(Class_id.split("_")[1]);


        const Find_ts = Task_objectes.find(t => t.t_id === o_id);
        if (Find_ts) {
            Find_ts.t_status = '_Active';
        };

    };
    console.log(filtered_Task_Name);

    Set_Storage();
    findCategory('_Active', 'active_button');
    console.log("Active Done !");

};



Activer.addEventListener('click', () => {
    Sort_Filter_Active();

});


//-------Complete Part


let Completed_Task = [];

function Sort_Filter_Complet() {

    is_Act_Run = false;

    for (let t = 0; t < Selected_Item.length; t++) {
        f_list_len++


        let content_C = Selected_Item[t];
        content_C.classList.remove("_Active", "_Completed");
        content_C.classList.add("_Completed");

        //____________________________Local Storage Set




        //________Local Storage Set
        Class_id_c = content_C.classList[0];
        o_id_c = parseInt(Class_id_c.split("_")[1]);


        const Find_ts_c = Task_objectes.find(t => t.t_id === o_id_c);
        if (Find_ts_c) {
            Find_ts_c.t_status = '_Completed';
        };

    };

    Set_Storage();

    findCategory('_Completed', 'complete_button');
    console.log("Complete Done !");

};







Completer.addEventListener('click', () => {


    Sort_Filter_Complet();



});




//__________________________________________ Category s


//---------

//______________________________

f_act_b.addEventListener('click', () => {
    findCategory('_Active', 'active_button');
});


//_________________________

f_cmp_b.addEventListener('click', () => {
    findCategory('_Completed', 'complete_button');
})


//____________________________

f_all_b.addEventListener('click', () => {
    findCategory('_All', 'All_button');
})






//_______________________________________  Restore Task in Storage

function Task_Restore() {
    const Saved_Task = JSON.parse(localStorage.getItem('_Tasks_List')) || [];
    Task_Count = Saved_Task.length > 0 ? Saved_Task[Saved_Task.length - 1].t_id : 0;
    console.log(Saved_Task);
    Saved_Task.forEach(element => {

        console.log(element.t_name);
        const Stored_t = new createTaskEl(element);
        Stored_t.Main_F();
    });
};

Task_Restore();









//_____________________________ Needs List :




//night and light theme




//All filter

//Dont Show the filters after add
//Dont Remove the filter class from task item





// drag and sort task

// Limit for task List and Next Task page