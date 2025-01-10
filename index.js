document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const searchInput = document.getElementById("searchInput");

    // Adicionar tarefa
    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();

        if (taskText === "") {
            alert("Por favor, insira uma tarefa.");
            return;
        }

        createTask(taskText);
        taskInput.value = "";
        taskInput.focus();
    });

    // Criar elemento de tarefa
    function createTask(taskText) {
        const taskItem = document.createElement("li");

        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" />
            <span>${taskText}</span>
            <input type="text" class="edit-task" value="${taskText}" />
            <button class="edit-btn">Editar</button>
            <button class="save-btn" style="display:none;">Salvar</button>
            <button class="remove-btn">Remover</button>
        `;

        // Remover tarefa
        taskItem.querySelector(".remove-btn").addEventListener("click", () => {
            taskList.removeChild(taskItem);
        });

        // Marcar/desmarcar como concluída
        taskItem.querySelector(".task-checkbox").addEventListener("change", (event) => {
            if (event.target.checked) {
                taskItem.classList.add("completed");
                taskList.appendChild(taskItem); // Manda para o fim
            } else {
                taskItem.classList.remove("completed");
                taskList.prepend(taskItem); // Manda para o início
            }
        });

        // Editar tarefa
        const editBtn = taskItem.querySelector(".edit-btn");
        const saveBtn = taskItem.querySelector(".save-btn");
        const editInput = taskItem.querySelector(".edit-task");
        const taskTextSpan = taskItem.querySelector("span");

        editBtn.addEventListener("click", () => {
            taskItem.classList.add("editing");
            editInput.focus();
            editBtn.style.display = "none";
            saveBtn.style.display = "inline-block";
        });

        // Salvar edição
        saveBtn.addEventListener("click", () => {
            const updatedText = editInput.value.trim();
            if (updatedText === "") {
                alert("O texto da tarefa não pode ser vazio.");
                return;
            }
            taskTextSpan.textContent = updatedText;
            editInput.value = updatedText;

            taskItem.classList.remove("editing");
            editBtn.style.display = "inline-block";
            saveBtn.style.display = "none";
        });

        // Cancelar edição ao pressionar Enter
        editInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                saveBtn.click();
            }
        });

        taskList.prepend(taskItem); // Adiciona no início da lista
    }

    // Pesquisa de tarefas
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const tasks = Array.from(taskList.children);

        tasks.forEach(task => {
            const taskText = task.querySelector("span").textContent.toLowerCase();
            if (taskText.includes(query)) {
                task.style.display = "flex";
            } else {
                task.style.display = "none";
            }
        });
    });
});
