
document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const dateInput = document.getElementById("dateInput");
    const addTaskBtn = document.getElementById("addTaskBtn");

    const pendingTasks = document.getElementById("pendingTasks");
    const completedTasks = document.getElementById("completedTasks");
    const overdueTasks = document.getElementById("overdueTasks");

    const searchInput = document.getElementById("searchInput");
    const pendingCount = document.getElementById("pendingCount");
    const completedCount = document.getElementById("completedCount");
    const overdueCount = document.getElementById("overdueCount");

    // Função para exibir mensagens temporárias
    function showMessage(message, type = "success") {
        const messageBox = document.createElement("div");
        messageBox.className = `message-box ${type}`;
        messageBox.textContent = message;

        document.body.appendChild(messageBox);

        setTimeout(() => {
            messageBox.remove();
        }, 3000);
    }

    // Atualizar contadores
    function updateCounters() {
        pendingCount.textContent = pendingTasks.children.length;
        completedCount.textContent = completedTasks.children.length;
        overdueCount.textContent = overdueTasks.children.length;
    }

    // Adicionar tarefa
    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value;

        if (!taskText || !taskDate) {
            alert("Por favor, preencha a tarefa e a data/hora.");
            return;
        }

        createTask(taskText, taskDate);

        // Mensagem de sucesso
        showMessage(`Tarefa "${taskText}" adicionada com sucesso!`);

        taskInput.value = "";
        dateInput.value = "";
        taskInput.focus();
    });

    // Criar elemento de tarefa
    function createTask(taskText, taskDate) {
        const taskItem = document.createElement("li");

        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" />
            <span>${taskText}</span>
            <span class="task-date">${taskDate}</span>
            <input type="text" class="edit-task" value="${taskText}" />
            <button class="edit-btn">Editar</button>
            <button class="save-btn" style="display:none;">Salvar</button>
            <button class="remove-btn">Remover</button>
        `;

        // Remover tarefa
        taskItem.querySelector(".remove-btn").addEventListener("click", () => {
            const confirmed = confirm(`Tem certeza de que deseja remover a tarefa "${taskText}"?`);
            if (confirmed) {
                taskItem.remove();
                updateCounters();
            }
        });

        // Marcar/desmarcar como concluída
        taskItem.querySelector(".task-checkbox").addEventListener("change", (event) => {
            if (event.target.checked) {
                taskItem.classList.add("completed");
                taskItem.classList.remove("overdue");
                completedTasks.appendChild(taskItem);
            } else {
                taskItem.classList.remove("completed");
                pendingTasks.appendChild(taskItem);
            }
            updateCounters();
        });

        // Editar tarefa
        const editBtn = taskItem.querySelector(".edit-btn");
        const saveBtn = taskItem.querySelector(".save-btn");
        const editInput = taskItem.querySelector(".edit-task");
        const taskTextSpan = taskItem.querySelector("span");

        editBtn.addEventListener("click", () => {
            const confirmed = confirm(`Tem certeza de que deseja editar a tarefa "${taskText}"?`);
            if (confirmed) {
                taskItem.classList.add("editing");
                editInput.focus();
                editBtn.style.display = "none";
                saveBtn.style.display = "inline-block";
            }
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

        pendingTasks.appendChild(taskItem);
        updateCounters();

        // Monitorar tempo da tarefa individualmente
        monitorTaskTime(taskItem, taskDate);
    }

    // Monitorar tempo da tarefa
    function monitorTaskTime(taskItem, taskDate) {
        const taskTime = new Date(taskDate).getTime();

        const checkTime = () => {
            const now = Date.now();

            if (!taskItem.classList.contains("completed")) {
                if (taskTime <= now) {
                    if (!taskItem.classList.contains("overdue")) {
                        alert(`A tarefa "${taskItem.querySelector("span").textContent}" está atrasada ou na hora de execução!`);
                    }
                    taskItem.classList.add("overdue");
                    overdueTasks.appendChild(taskItem);
                } else {
                    taskItem.classList.remove("overdue");
                    pendingTasks.appendChild(taskItem);
                }
                updateCounters();
            }
        };

        // Checar imediatamente e a cada minuto
        checkTime();
        setInterval(checkTime, 60000);
    }

    // Pesquisa de tarefas
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const allTasks = [...pendingTasks.children, ...completedTasks.children, ...overdueTasks.children];

        allTasks.forEach(task => {
            const taskText = task.querySelector("span").textContent.toLowerCase();
            if (taskText.includes(query)) {
                task.style.display = "flex";
            } else {
                task.style.display = "none";
            }
        });
    });
});
