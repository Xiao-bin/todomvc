var task_list = [];
var flag = 0;
init();//初始化
addTask();//回车添加任务
clickSelect();//点击选中按钮
clearCompleted();//点击清空完成任务
checkboxAll();//单击全选框

function init() {
	//只要是绑定初始化出来的标签都需要放到初始化函数中再次绑定
	task_list = store.get("tasks") || [];
	flag = store.get("flag") || 0;
	addTaskList();//添任务列表
	editTask();//点击任务可编辑
	delTask();//点击删除单条任务
	checkbox();//点击单选框
	count();//统计完成的任务数跟未完成的任务进行布局
}

//回车添加任务
function addTask() {
	$(".new-todo").on("keydown", function (ev) {
		var key = ev.which;//获取按下去的键值
		if (key == 13) {//回车为13
			var obj = {};
			obj.content = $(this).val();
			var reg = /.*[^ ].*/;//正则匹配非空
			if (!reg.test(obj.content)) return;
			add_task(obj);
			$(this).val(null);
			init();
		}
	})
}

//添加单条任务进数组跟本地
function add_task(obj) {
	//将对象存入数组中
	task_list.push(obj);
	//将数组存入本地
	store.set("tasks", task_list);
}

//添加任务列表html
function addTaskList() {
	var $todo_list = $(".todo-list");
	var $filtersA = $(".filters a");
	var str = [];
	$todo_list.html(null);
	$filtersA.removeAttr("class");
	if(task_list.length ==0){
		$(".main").hide();
		$(".footer").hide();
	}else{
		$(".main").show();
		$(".footer").show();
	}
	$(task_list).each(function (index, ele) {
		//根据本地数据显示被选中的按钮还有该显示的任务
		switch (flag) {
			case 0 :
				$filtersA.eq(0).attr("class", "selected");
				str = taskHtml(index, ele);
				$todo_list.prepend(str);
				break;
			case 1 :
				$filtersA.eq(1).attr("class", "selected");
				if (!ele.completed) {
					str = taskHtml(index, ele);
					$todo_list.prepend(str);
				}
				break;
			case 2 :
				$filtersA.eq(2).attr("class", "selected");
				if (ele.completed) {
					str = taskHtml(index, ele);
					$todo_list.prepend(str);
				}
				break;
		}
	});
}
//单条任务的html
function taskHtml(index, ele) {
	var str = '<li data-index="' + (index) + '" class=' + (ele.completed ? "completed" : "") + '>' +
		'<div class="view">' +
		'<input class="toggle" type="checkbox" ' + ((ele.completed) ? "checked" : "") + '>' +
		'<label>' + ele.content + '</label>' +
		'<button class="destroy"></button>' +
		'</div>' +
		'<input class="edit" value="' + ele.content + '">' +
		'</li>';
	return str;
}
//点击任务可编辑
function editTask() {
	$(".todo-list li").off("dblclick");
	$(".todo-list li").on("dblclick", function () {
		/*	var index = $(this).index();
		 console.log(index);*/
		$(this).addClass("editing");
		var $edit = $(this).find(".edit");
		$edit.focus().val($edit.val());
		$edit.on("blur", function () {
			/*	console.log(1);*/
			$(this).parent().removeClass("editing");
			var index = $(this).parent().data("index");
			task_list[index].content = $(this).val();
			store.set("tasks",task_list);
			init();
		});
		$edit.on("keydown", function (ev) {
			var key = ev.which;//获取按下去的键值
			if (key == 13) {//回车为13
				/*	console.log(1);*/
				$(this).parent().removeClass("editing");
				var index = $(this).parent().data("index");
				task_list[index].content = $(this).val();
				store.set("tasks",task_list);
				init();
			}
		});
	});

}
//删除单条任务
function delTask() {
	$(".destroy").click(function () {
		var index = $(this).parent().parent().data("index");
		/*console.log(index);*/
		task_list.splice(index, 1);
		store.set("tasks", task_list);
		init();
	})
}

//点击单个选择框
function checkbox() {
	$(".toggle").click(function () {
		var index = $(this).parent().parent().data("index");
		/*	console.log(index);*/
		if (task_list[index].completed) {
			task_list[index].completed = false;
		} else {
			task_list[index].completed = true;
		}
		store.set("tasks", task_list);
		init();
	});
}

//判断是否全选，以及设置未完成任务的数目跟是否显示清空按钮
function count() {
	var count = 0;
	for (var i = 0; i < task_list.length; i++) {
		if (task_list[i].completed) {
			count++;
		}
	}
	var sum = task_list.length - count;
	$(".todo-count strong").text(sum);
	if (count != 0) {
		$(".clear-completed").show();
	} else {
		$(".clear-completed").hide();
	}
	/*console.log(count);*/
	var $checkAll = $("#toggle-all");
	if (count == task_list.length) {
		$checkAll.prop("checked", "true");
	} else {
		$checkAll.prop("checked", null);
	}
}

//点击选择所有选择框
function checkboxAll() {
	$("#toggle-all").bind("click", function () {
		/*console.log($(this).prop("checked"));*/
		for (var i = 0; i < task_list.length; i++) {
			if ($(this).prop("checked")) {
				task_list[i].completed = true;
			} else {
				task_list[i].completed = false;
			}
		}
		store.set("tasks", task_list);
		/*	$("#toggle-all").unbind("click");*/
		init();
	});
}

//点击显示按钮
function clickSelect() {
	$(".filters a").on("click", function () {
		/*console.log($(this).attr("class"));*/
		/*$(this).attr("class","selected")
		 .parent().siblings().children().removeAttr("class");*/
		var index = $(this).parent().index();
		store.set("flag", index);
		init();
	});
}

//点击清空完成任务
function clearCompleted() {
	$(".clear-completed").on("click", function () {
		for (var i = 0; i < task_list.length; i++) {
			if (task_list[i].completed) {
				/*num.push(i);*/
				task_list.splice(i, 1);
				i = i - 1;
			}
		}
		store.set("tasks", task_list);
		init();
	})
}
