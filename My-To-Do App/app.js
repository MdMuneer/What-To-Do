const listsContainer = document.querySelector('[data-lists]')
const newListform = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listdisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')



const LOCAL_STORAGE_LIST_KEY  = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_KEY  = 'task.selectedListId';



listsContainer.addEventListener('click', e => {
	if (e.target.tagName.toLowerCase() ==='li'){
		selectedListId = e.target.dataset.listId
		saveandRender()
	}
})

deleteListButton.addEventListener('click', e => {
	lists = lists.filter(list=> list.id  !== selectedListId)
	selectedListId  = null
	saveandRender();
})


let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let  selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY)

newListform.addEventListener('submit', e =>  {
	e.preventDefault();
	const listName= newListInput.value
	if(listName == null || listName === '') return
		const list = createList(listName)
		newListInput.value = null
		lists.push(list)
		saveandRender();
})

newTaskform.addEventListener('submit', e =>  {
	e.preventDefault();
	const listName= newListInput.value
	if(listName == null || listName === '') return
		const list = createList(listName)
		newListInput.value = null
		lists.push(list)
		saveandRender();
})

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function saveandRender() {
	save()
	render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, selectedListId)

}


function render() {
	clearElement(listsContainer)
	renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
	if (selectedListId == null) {
		listdisplayContainer.style.display = 'none';
	} else {
		listdisplayContainer.style.display = '';
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(tasksContainer)
    renderTasks(selectedList)

	}
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true) // true - to get everything inside the template  
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
}


function clearElement(element){
	while (element.firstChild) {  //remove all the existing elements
		element.removeChild(element.firstChild)
	}
}

render()