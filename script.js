const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const tasks = document.querySelectorAll(".task");
const toggle = document.querySelector("#toggle-modal")
const modal = document.querySelector(".modal")
const modalBg = document.querySelector(".modal .bg")
const addTaskButton = document.querySelector("#add-new-task")
const columns = [todo, progress, done];
let dragElement = null;
let tasksData = {}

function addTask(title, desc, column){
    const div = document.createElement("div")
    div.classList.add("task")
    div.setAttribute("draggable", "true")

    div.innerHTML = `
                    <h2>${title}</h2>
                    <p>${desc}</p>
                    <button>Delete</button>
                    `
    column.appendChild(div)

    div.addEventListener("drag", (e)=>{
        dragElement = div;
    })

    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", ()=>{
        div.remove();
        updateTaskCount();
    })

    return div;

}

function updateTaskCount(){
    columns.forEach(col =>{
            const tasks = col.querySelectorAll(".task");
            const count = col.querySelector(".right");

            tasksData[col.id] = Array.from(tasks).map(t => { 
                return{
                    title: t.querySelector("h2").innerText,
                    desc: t.querySelector("p").innerText
                }
            })
            localStorage.setItem("tasks", JSON.stringify(tasksData));
            count.innerText = tasks.length;
        })
}

if(localStorage.getItem("tasks")){
    const data = JSON.parse(localStorage.getItem("tasks"));

    for(const col in data){
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task =>{
            addTask(task.title, task.desc, column);
        })
    }

    updateTaskCount();
}

tasks.forEach(task => {
    task.addEventListener("drag", (e) =>{
    dragElement = task;
    })
})

function addDragEventColumn(column){
    column.addEventListener("dragenter",(e)=>{
        e.preventDefault();
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave",(e)=>{
        e.preventDefault()
        column.classList.remove("hover-over");
    })

    column.addEventListener("dragover",(e)=>{
        e.preventDefault()
    })

    column.addEventListener("drop",(e)=>{
        e.preventDefault()
        
        column.appendChild(dragElement);
        column.classList.remove("hover-over")

        updateTaskCount();
        
    })
}

addDragEventColumn(todo);
addDragEventColumn(progress);
addDragEventColumn(done);

toggle.addEventListener("click",()=>{
    modal.classList.toggle("active")
})

modalBg.addEventListener("click",()=>{
    modal.classList.remove("active")
})

addTaskButton.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title-input").value.trim();
    const taskDesc = document.querySelector("#text-desc-input").value.trim();

    if (!taskTitle || !taskDesc) {
        alert("Please fill both title and description before adding a task.");
        return;
    }

    addTask(taskTitle, taskDesc, todo);

    updateTaskCount();
    modal.classList.remove("active");

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#text-desc-input").value = "";
});
