const students = [
  {id:'HV001',name:'Nguyễn Minh Anh',phone:'090 123 4567',email:'minhanh@example.com',dob:'2008-04-12',gender:'Nữ',address:'Quận 3, TP. Hồ Chí Minh',status:'Đang hoạt động'},
  {id:'HV002',name:'Trần Hoàng Nam',phone:'091 234 5678',email:'hoangnam@example.com',dob:'2007-09-25',gender:'Nam',address:'Quận 10, TP. Hồ Chí Minh',status:'Đang hoạt động'},
  {id:'HV003',name:'Lê Thảo Nhi',phone:'093 345 6789',email:'',dob:'2009-02-10',gender:'Nữ',address:'Quận Phú Nhuận, TP. Hồ Chí Minh',status:'Đang hoạt động'},
  {id:'HV004',name:'Phạm Gia Huy',phone:'098 456 7890',email:'giahuy@example.com',dob:'2006-12-03',gender:'Nam',address:'Quận Bình Thạnh, TP. Hồ Chí Minh',status:'Đang hoạt động'},
  {id:'HV005',name:'Đỗ Ngọc Hà',phone:'096 567 8901',email:'ngocha@example.com',dob:'2008-06-18',gender:'Nữ',address:'Quận 1, TP. Hồ Chí Minh',status:'Đang hoạt động'}
];
const teachers = [
  {id:'GV001',name:'Nguyễn Thu Trang',phone:'090 111 2233',email:'trang.nguyen@example.com',major:'IELTS',qualification:'Thạc sĩ Ngôn ngữ Anh',status:'Đang hoạt động'},
  {id:'GV002',name:'Trần Quốc Bảo',phone:'090 222 3344',email:'bao.tran@example.com',major:'TOEIC',qualification:'Cử nhân Sư phạm Anh',status:'Đang hoạt động'},
  {id:'GV003',name:'Lê Mỹ Linh',phone:'090 333 4455',email:'linh.le@example.com',major:'Giao tiếp',qualification:'Cử nhân Ngôn ngữ Anh',status:'Đang hoạt động'}
];
const courses = [
  {id:'KH001',name:'IELTS Foundation',description:'Nền tảng tiếng Anh học thuật và luyện thi IELTS.',fee:4500000,duration:54,level:'Sơ cấp'},
  {id:'KH002',name:'TOEIC Accelerator',description:'Luyện kỹ năng và chiến lược làm bài TOEIC.',fee:3800000,duration:45,level:'Trung cấp'},
  {id:'KH003',name:'English Together',description:'Phát triển phản xạ và giao tiếp tiếng Anh thực tế.',fee:3200000,duration:32,level:'Mọi trình độ'}
];
const classrooms = [
  {id:'LOP001',name:'IELTS Foundation · Tối',courseId:'KH001',teacherId:'GV001',start:'2026-10-12',end:'2026-12-30',schedule:'Thứ 2, 4, 6 · 18:00–19:30',room:'P.201',max:20,status:'Đang tuyển'},
  {id:'LOP002',name:'TOEIC Accelerator · Tối',courseId:'KH002',teacherId:'GV002',start:'2026-10-13',end:'2026-12-22',schedule:'Thứ 3, 5 · 19:00–20:30',room:'P.202',max:3,status:'Đang tuyển'},
  {id:'LOP003',name:'English Together · Cuối tuần',courseId:'KH003',teacherId:'GV003',start:'2026-10-17',end:'2026-12-12',schedule:'Thứ 7 · 09:00–11:00',room:'P.101',max:15,status:'Đang tuyển'}
];
const enrollments = [
  {id:'DK001',studentId:'HV001',classId:'LOP001',date:'2026-09-20',status:'Hiệu lực'},
  {id:'DK002',studentId:'HV002',classId:'LOP002',date:'2026-09-21',status:'Hiệu lực'},
  {id:'DK003',studentId:'HV003',classId:'LOP002',date:'2026-09-22',status:'Hiệu lực'},
  {id:'DK004',studentId:'HV004',classId:'LOP002',date:'2026-09-23',status:'Hiệu lực'}
];

const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const content = document.querySelector('#content');
const registrationDialog = document.querySelector('#registration');
const managementDialog = document.querySelector('#management-dialog');
const labels = {
  overview:'Tổng quan',
  students:'Học viên',
  teachers:'Giáo viên',
  courses:'Khóa học',
  classes:'Lớp học',
  enroll:'Đăng ký lớp',
  reports:'Thống kê', profile:'Tài khoản'
};
const entities = {student:students,teacher:teachers,course:courses,classroom:classrooms};
const entityLabels = {student:'học viên',teacher:'giáo viên',course:'khóa học',classroom:'lớp học'};
let demoSession=false;
let page = 'overview';
let opener = null;
let selectedClassId = '';
let toastTimer;

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const normalize = value => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
const lookup = (collection,id) => collection.find(item=>item.id===id);
const activeEnrollments = classId => enrollments.filter(item=>item.classId===classId&&item.status==='Hiệu lực');
const classSize = classId => activeEnrollments(classId).length;
const money = value => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND',maximumFractionDigits:0}).format(value);
const dateText = value => value ? new Intl.DateTimeFormat('vi-VN').format(new Date(`${value}T00:00:00`)) : '—';
const statusBadge = status => `<span class="badge ${status==='Đang tuyển'||status==='Đang hoạt động'||status==='Hiệu lực'?'':'muted-badge'}">${escapeHTML(status)}</span>`;
const code = (prefix,list) => `${prefix}${String(Math.max(0,...list.map(item=>Number(item.id.replace(prefix,''))||0))+1).padStart(3,'0')}`;

function pageIntro(description,action) {
  return `<div class="intro section-head"><div><span class="eyebrow">KHÔNG GIAN ĐIỀU HÀNH</span><h1>${page==='overview'?'Một ngày học tập hiệu quả.':labels[page]}</h1><p class="muted">${description}</p></div>${action||''}</div>`;
}

function classTable(list=classrooms) {
  if (!list.length) return '<div class="empty">Chưa có lớp học. Hãy tạo lớp đầu tiên.</div>';
  return `<div class="table-wrap"><table><thead><tr><th>Lớp học</th><th>Giáo viên / lịch học</th><th>Sĩ số</th><th>Trạng thái</th><th></th></tr></thead><tbody>${list.map(c=>{
    const course=lookup(courses,c.courseId);
    const teacher=lookup(teachers,c.teacherId);
    const full=classSize(c.id)>=c.max;
    return `<tr><td><b>${escapeHTML(c.name)}</b><small>${escapeHTML(c.id)} · ${escapeHTML(course?.name||'Chưa gán khóa học')}</small></td><td><b>${escapeHTML(teacher?.name||'Chưa phân công')}</b><small>${escapeHTML(c.schedule)} · ${escapeHTML(c.room)}</small></td><td>${classSize(c.id)} / ${c.max}<div class="progress"><i style="width:${Math.min(100,classSize(c.id)/c.max*100)}%"></i></div></td><td>${statusBadge(c.status)}${full?'<span class="badge full">Đủ sĩ số</span>':''}</td><td class="actions"><button data-edit="classroom" data-id="${escapeHTML(c.id)}">Sửa</button><button data-roster="${escapeHTML(c.id)}">Danh sách</button></td></tr>`;
  }).join('')}</tbody></table></div>`;
}

function renderOverview() {
  const activeStudents=students.filter(s=>s.status==='Đang hoạt động').length;
  const activeTeachers=teachers.filter(t=>t.status==='Đang hoạt động').length;
  const recruiting=classrooms.filter(c=>isOpen(c)&&classSize(c.id)<c.max);
  return pageIntro('Nắm bắt hoạt động trung tâm và kết nối những lớp học tiếp theo.','<button class="primary" data-register>＋ Đăng ký lớp</button>')+
    `<div class="stats">${[['Học viên',activeStudents,'Hồ sơ đang hoạt động','◉'],['Giáo viên',activeTeachers,'Đang công tác','♧'],['Lớp học',classrooms.length,'Lớp trong danh sách','▦'],['Khóa học',courses.length,'Chương trình đào tạo','◇']].map(s=>`<div class="stat"><span class="stat-icon">${s[3]}</span><span class="muted">${s[0]}</span><strong>${String(s[1]).padStart(2,'0')}</strong><small>${s[2]}</small></div>`).join('')}</div>
    <div class="grid"><section class="panel"><div class="section-head"><h2>Lớp học đang tuyển</h2><button data-go="classes">Tất cả lớp →</button></div>${classTable(classrooms.filter(c=>c.status==='Đang tuyển'))}<p class="muted">${recruiting.length} lớp còn chỗ để đón học viên mới.</p></section><div><section class="panel feature"><span class="eyebrow">BƯỚC TIẾP THEO</span><h2>Mở ra một hành trình<br>học tập mới.</h2><p>Chọn học viên, tìm lớp còn chỗ và hoàn tất đăng ký ngay tại đây.</p><button data-register>Đăng ký học viên →</button></section><section class="panel"><h2>Quy trình nhanh</h2><div class="steps">${[['01','Kiểm tra hồ sơ','Tìm học viên trước khi xếp lớp.'],['02','Chọn lớp phù hợp','Đối chiếu lịch học và sĩ số.'],['03','Xác nhận đăng ký','Danh sách lớp được cập nhật.']].map(s=>`<div class="step"><span class="avatar">${s[0]}</span><div><b>${s[1]}</b><p>${s[2]}</p></div></div>`).join('')}</div></section></div></div>`;
}

function studentRows(query='',status='') {
  const filtered=students.filter(s=>(!status||s.status===status)&&normalize([s.id,s.name,s.phone,s.email].join(' ')).includes(normalize(query)));
  if (!filtered.length) return '<div class="empty">Không tìm thấy học viên. Thử từ khóa khác hoặc xóa bộ lọc.</div>';
  return `<div class="table-wrap"><table><thead><tr><th>Học viên</th><th>Liên hệ</th><th>Lớp đang học</th><th>Trạng thái</th><th></th></tr></thead><tbody>${filtered.map(s=>{
    const classes=enrollments.filter(e=>e.status==='Hiệu lực'&&e.studentId===s.id).map(e=>lookup(classrooms,e.classId)?.name).filter(Boolean);
    return `<tr><td><b>${escapeHTML(s.name)}</b><small>${escapeHTML(s.id)} · ${escapeHTML(s.gender||'Chưa cập nhật')}</small></td><td>${escapeHTML(s.phone||'—')}<small>${escapeHTML(s.email||'')}</small></td><td>${classes.length?classes.map(escapeHTML).join(', '):'<span class="muted">Chưa đăng ký lớp</span>'}</td><td>${statusBadge(s.status)}</td><td class="actions"><button data-edit="student" data-id="${escapeHTML(s.id)}">Sửa</button><button data-toggle-status="student" data-id="${escapeHTML(s.id)}">${s.status==='Đang hoạt động'?'Ngừng':'Kích hoạt'}</button></td></tr>`;
  }).join('')}</tbody></table></div>`;
}

function renderStudents() {
  content.innerHTML=pageIntro('Quản lý hồ sơ, thông tin liên hệ và tình trạng học tập.','<button class="primary" data-add="student">＋ Thêm học viên</button>')+
    `<div class="toolbar"><input id="list-search" aria-label="Tìm học viên" placeholder="Tìm mã, tên, email hoặc số điện thoại…"><select id="status-filter" aria-label="Lọc trạng thái"><option value="">Tất cả trạng thái</option><option>Đang hoạt động</option><option>Ngừng hoạt động</option></select></div><section class="panel"><div id="list-results">${studentRows()}</div></section>`;
}

function renderTeachers() {
  const rows=teachers.map(t=>{
    const assigned=classrooms.filter(c=>c.teacherId===t.id).map(c=>c.name);
    return `<tr><td><b>${escapeHTML(t.name)}</b><small>${escapeHTML(t.id)} · ${escapeHTML(t.major)}</small></td><td>${escapeHTML(t.phone||'—')}<small>${escapeHTML(t.email||'')}</small></td><td>${escapeHTML(t.qualification||'—')}</td><td>${assigned.length?assigned.map(escapeHTML).join(', '):'<span class="muted">Chưa phân công</span>'}</td><td>${statusBadge(t.status)}</td><td class="actions"><button data-edit="teacher" data-id="${escapeHTML(t.id)}">Sửa</button><button data-toggle-status="teacher" data-id="${escapeHTML(t.id)}">${t.status==='Đang hoạt động'?'Ngừng':'Kích hoạt'}</button></td></tr>`;
  }).join('');
  content.innerHTML=pageIntro('Theo dõi chuyên môn, liên hệ và lớp đang phụ trách.','<button class="primary" data-add="teacher">＋ Thêm giáo viên</button>')+
    `<section class="panel">${teachers.length?`<div class="table-wrap"><table><thead><tr><th>Giáo viên</th><th>Liên hệ</th><th>Trình độ</th><th>Lớp phụ trách</th><th>Trạng thái</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`:'<div class="empty">Chưa có giáo viên. Hãy thêm hồ sơ giáo viên.</div>'}</section>`;
}

function renderCourses() {
  const rows=courses.map(c=>{
    const related=classrooms.filter(cl=>cl.courseId===c.id);
    return `<tr><td><b>${escapeHTML(c.name)}</b><small>${escapeHTML(c.id)} · ${escapeHTML(c.level)}</small></td><td>${escapeHTML(c.description||'—')}</td><td>${money(c.fee)}</td><td>${c.duration} giờ</td><td>${related.length?related.map(cl=>escapeHTML(cl.name)).join(', '):'<span class="muted">Chưa mở lớp</span>'}</td><td class="actions"><button data-edit="course" data-id="${escapeHTML(c.id)}">Sửa</button></td></tr>`;
  }).join('');
  content.innerHTML=pageIntro('Danh mục chương trình, trình độ, thời lượng và học phí niêm yết.','<button class="primary" data-add="course">＋ Thêm khóa học</button>')+
    `<section class="panel">${courses.length?`<div class="table-wrap"><table><thead><tr><th>Khóa học</th><th>Mô tả</th><th>Học phí</th><th>Thời lượng</th><th>Lớp đang mở</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`:'<div class="empty">Chưa có khóa học. Hãy thêm chương trình đầu tiên.</div>'}</section>`;
}

function renderClasses() {
  content.innerHTML=pageIntro('Theo dõi lịch học, giáo viên và chỗ trống trong từng lớp.','<button class="primary" data-add="classroom">＋ Tạo lớp học</button>')+
    `<section class="panel">${classTable()}${selectedClassId?renderRoster(selectedClassId):''}</section>`;
}

function renderRoster(classId) {
  const classroom=lookup(classrooms,classId);
  if (!classroom) return '';
  const roster=activeEnrollments(classId).map(e=>lookup(students,e.studentId)).filter(Boolean);
  return `<div class="roster"><div class="section-head"><h2>Danh sách học viên · ${escapeHTML(classroom.name)}</h2><button data-clear-roster>Đóng</button></div>${roster.length?`<div class="table-wrap"><table><thead><tr><th>Mã học viên</th><th>Họ tên</th><th>Điện thoại</th><th>Ngày đăng ký</th></tr></thead><tbody>${roster.map(s=>{const enrollment=activeEnrollments(classId).find(e=>e.studentId===s.id);return `<tr><td>${escapeHTML(s.id)}</td><td>${escapeHTML(s.name)}</td><td>${escapeHTML(s.phone||'—')}</td><td>${dateText(enrollment.date)}</td></tr>`}).join('')}</tbody></table></div>`:'<div class="empty">Lớp chưa có học viên đăng ký hiệu lực.</div>'}</div>`;
}

function renderEnrollments() {
  const rows=enrollments.map(e=>{
    const student=lookup(students,e.studentId);
    const classroom=lookup(classrooms,e.classId);
    const actions=e.status==='Hiệu lực'?`<button data-transfer="${escapeHTML(e.id)}">Chuyển lớp</button><button data-cancel-enrollment="${escapeHTML(e.id)}">Hủy</button>`:'';
    return `<tr><td><b>${escapeHTML(student?.name||'Học viên không tồn tại')}</b><small>${escapeHTML(e.studentId)} · ${dateText(e.date)}</small></td><td><b>${escapeHTML(classroom?.name||'Lớp không tồn tại')}</b><small>${escapeHTML(classroom?.id||e.classId)}</small></td><td>${statusBadge(e.status)}</td><td class="actions">${actions}</td></tr>`;
  }).join('');
  content.innerHTML=pageIntro('Đăng ký, hủy hoặc chuyển học viên giữa các lớp.','<button class="primary" data-register>＋ Đăng ký lớp</button>')+
    `<section class="panel"><div class="section-head"><h2>Lịch sử đăng ký</h2><span class="muted">${enrollments.length} lượt đăng ký</span></div>${rows?`<div class="table-wrap"><table><thead><tr><th>Học viên</th><th>Lớp học</th><th>Trạng thái</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`:'<div class="empty">Chưa có đăng ký lớp nào.</div>'}</section>`;
}

function renderReports() {
  const active=enrollments.filter(e=>e.status==='Hiệu lực');
  const courseRows=courses.map(course=>{
    const ids=classrooms.filter(c=>c.courseId===course.id).map(c=>c.id);
    const count=new Set(active.filter(e=>ids.includes(e.classId)).map(e=>e.studentId)).size;
    return `<tr><td>${escapeHTML(course.name)}</td><td>${classrooms.filter(c=>c.courseId===course.id).length}</td><td>${count}</td><td>${money(course.fee)}</td></tr>`;
  }).join('');
  const teacherRows=teachers.map(teacher=>{
    const assigned=classrooms.filter(c=>c.teacherId===teacher.id);
    return `<tr><td>${escapeHTML(teacher.name)}</td><td>${assigned.length}</td><td>${assigned.reduce((sum,c)=>sum+classSize(c.id),0)}</td></tr>`;
  }).join('');
  content.innerHTML=pageIntro('Tổng hợp học viên theo khóa học và lớp theo giáo viên.')+
    `<div class="stats">${[['Tổng lượt đăng ký',active.length,'Đang hiệu lực'],['Lớp còn chỗ',classrooms.filter(c=>isOpen(c)&&classSize(c.id)<c.max).length,'Đang tuyển'],['Tổng chỗ còn',classrooms.filter(c=>c.status==='Đang tuyển').reduce((sum,c)=>sum+Math.max(0,c.max-classSize(c.id)),0),'Ở lớp đang tuyển'],['Tỷ lệ lấp đầy',classrooms.length?`${Math.round(classrooms.reduce((sum,c)=>sum+classSize(c.id),0)/classrooms.reduce((sum,c)=>sum+c.max,0)*100)}%`:'0%','Toàn trung tâm']].map(s=>`<div class="stat"><span class="muted">${s[0]}</span><strong>${s[1]}</strong><small>${s[2]}</small></div>`).join('')}</div>
    <div class="grid report-grid"><section class="panel"><h2>Học viên theo khóa học</h2><div class="table-wrap"><table><thead><tr><th>Khóa học</th><th>Số lớp</th><th>Học viên đang học</th><th>Học phí niêm yết</th></tr></thead><tbody>${courseRows||'<tr><td colspan="4">Chưa có dữ liệu.</td></tr>'}</tbody></table></div></section><section class="panel"><h2>Lớp theo giáo viên</h2><div class="table-wrap"><table><thead><tr><th>Giáo viên</th><th>Số lớp</th><th>Học viên</th></tr></thead><tbody>${teacherRows||'<tr><td colspan="3">Chưa có dữ liệu.</td></tr>'}</tbody></table></div></section></div>`;
}

function render() {
  if(!demoSession){renderLogin();return;}
  document.body.classList.remove('login-mode');
  document.querySelector('#breadcrumb').textContent=labels[page];
  document.querySelectorAll('[data-page]').forEach(button=>{
    const current=button.dataset.page===page;
    button.classList.toggle('active',current);
    if (current) button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  });
  if (page==='overview') content.innerHTML=renderOverview();
  else if (page==='students') renderStudents();
  else if (page==='teachers') renderTeachers();
  else if (page==='courses') renderCourses();
  else if (page==='classes') renderClasses();
  else if (page==='enroll') renderEnrollments();
  else if(page==='profile')renderProfile();
  else renderReports();
  enhancePage();
}

function navigate(next) {
  page=labels[next]?next:'overview';
  selectedClassId='';
  location.hash=page;
  render();
}

const field = (name,label,type='text',options={}) => ({name,label,type,...options});
const fieldConfigs = {
  student:[
    field('name','Họ và tên','text',{required:true,maxLength:100}),
    field('dob','Ngày sinh','date',{max:today()}),
    field('gender','Giới tính','select',{options:['Nam','Nữ','Khác']}),
    field('phone','Số điện thoại','tel',{maxLength:15}),
    field('email','Email','email',{maxLength:100}),
    field('address','Địa chỉ','text',{maxLength:255}),
    field('status','Trạng thái','select',{options:['Đang hoạt động','Ngừng hoạt động']})
  ],
  teacher:[
    field('name','Họ và tên','text',{required:true,maxLength:100}),
    field('dob','Ngày sinh','date',{max:today()}),
    field('gender','Giới tính','select',{options:['Nam','Nữ','Khác']}),
    field('phone','Số điện thoại','tel',{maxLength:15}),
    field('email','Email','email',{maxLength:100}),
    field('major','Chuyên môn','text',{maxLength:100}),
    field('qualification','Trình độ','text',{maxLength:100}),
    field('status','Trạng thái','select',{options:['Đang hoạt động','Ngừng hoạt động']})
  ],
  course:[
    field('name','Tên khóa học','text',{required:true,maxLength:100}),
    field('description','Mô tả','textarea',{maxLength:500}),
    field('fee','Học phí (VND)','number',{required:true,min:0,step:1000}),
    field('duration','Thời lượng (giờ)','number',{required:true,min:1,step:1}),
    field('level','Trình độ','text',{maxLength:50})
  ],
  classroom:[
    field('name','Tên lớp','text',{required:true,maxLength:100}),
    field('courseId','Khóa học','select',{required:true,source:'courses'}),
    field('teacherId','Giáo viên','select',{source:'teachers',optional:true}),
    field('start','Ngày bắt đầu','date'),
    field('end','Ngày kết thúc','date'),
    field('schedule','Lịch học','text',{maxLength:100,placeholder:'Ví dụ: Thứ 2, 4 · 18:00–19:30'}),
    field('room','Phòng học','text',{maxLength:50}),
    field('max','Sĩ số tối đa','number',{required:true,min:1,step:1}),
    field('status','Trạng thái','select',{options:['Nháp','Đang tuyển','Đang học','Hoàn thành','Đã hủy']})
  ]
};

function selectOptions(config,value) {
  let options=config.options||[];
  if (config.source==='courses') options=courses.map(item=>({value:item.id,label:item.name}));
  if (config.source==='teachers') options=teachers.filter(item=>item.status==='Đang hoạt động').map(item=>({value:item.id,label:item.name}));
  const normalized=options.map(option=>typeof option==='string'?{value:option,label:option}:option);
  return `${config.optional?'<option value="">Chưa phân công</option>':''}${normalized.map(option=>`<option value="${escapeHTML(option.value)}" ${String(option.value)===String(value??'')?'selected':''}>${escapeHTML(option.label)}</option>`).join('')}`;
}

function renderField(config,value='') {
  const attrs=`name="${config.name}" ${config.required?'required':''} ${config.min!==undefined?`min="${config.min}"`:''} ${config.max!==undefined?`max="${config.max}"`:''} ${config.step?`step="${config.step}"`:''} ${config.maxLength?`maxlength="${config.maxLength}"`:''} ${config.placeholder?`placeholder="${escapeHTML(config.placeholder)}"`:''}`;
  let input='';
  if (config.type==='select') input=`<select ${attrs}>${selectOptions(config,value)}</select>`;
  else if (config.type==='textarea') input=`<textarea ${attrs} rows="3">${escapeHTML(value)}</textarea>`;
  else input=`<input type="${config.type}" ${attrs} value="${escapeHTML(value)}">`;
  return `<label>${config.label}${input}</label>`;
}

function openEntityForm(entity,id,button) {
  const collection=entities[entity];
  const record=id?lookup(collection,id):null;
  opener=button;
  const heading=`${record?'Sửa':'Thêm'} ${entityLabels[entity]}`;
  managementDialog.innerHTML=`<form id="entity-form" data-entity="${entity}" data-id="${escapeHTML(id||'')}"><div class="section-head"><h2>${heading}</h2><button type="button" data-close-dialog aria-label="Đóng">×</button></div><div class="form-fields">${fieldConfigs[entity].map(config=>renderField(config,record?.[config.name]??(config.name==='status'?(entity==='classroom'?'Đang tuyển':'Đang hoạt động'):''))).join('')}</div><p class="form-error" role="alert"></p><div class="dialog-actions"><button type="button" data-close-dialog>Hủy</button><button class="primary" type="submit">Lưu thông tin</button></div></form>`;
  managementDialog.showModal();
}

function nextId(entity) {
  const prefixes={student:'HV',teacher:'GV',course:'KH',classroom:'LOP'};
  const list=entities[entity];
  return code(prefixes[entity],list);
}

function saveEntity(form) {
  const entity=form.dataset.entity;
  const collection=entities[entity];
  const id=form.dataset.id;
  const record=id?lookup(collection,id):null;
  const error=form.querySelector('.form-error');
  const values={};
  for (const config of fieldConfigs[entity]) {
    const raw=form.elements.namedItem(config.name).value.trim();
    values[config.name]=config.type==='number'?Number(raw):raw;
  }
  if ((entity==='student'||entity==='teacher')&&!values.phone&&!values.email) {
    error.textContent='Vui lòng nhập ít nhất số điện thoại hoặc email để liên hệ.';
    return;
  }
  if (entity==='course'&&values.duration<1) {
    error.textContent='Thời lượng phải lớn hơn 0.';
    return;
  }
  if (entity==='classroom') {
    if (values.end&&values.start&&values.end<values.start) {
      error.textContent='Ngày kết thúc không được trước ngày bắt đầu.';
      return;
    }
    if (record&&classSize(record.id)>values.max) {
      error.textContent='Sĩ số tối đa không được nhỏ hơn số học viên đang đăng ký.';
      return;
    }
  }
  const issue=validateEntity(entity,values,record);
  if(issue){error.textContent=issue;return;}
  if (record) Object.assign(record,values);
  else collection.push({id:nextId(entity),...values});
  managementDialog.close();
  render();
  showToast(`${record?'Đã cập nhật':'Đã thêm'} ${entityLabels[entity]}.`);
}

function changeStatus(entity,id) {
  const record=lookup(entities[entity],id);
  if (!record) return;
  const issue=validateEntity(entity,{...record,status:record.status==='Đang hoạt động'?'Ngừng hoạt động':'Đang hoạt động'},record);
  if(issue){showToast(issue);return;}
  record.status=record.status==='Đang hoạt động'?'Ngừng hoạt động':'Đang hoạt động';
  render();
  showToast(`${record.status==='Đang hoạt động'?'Đã kích hoạt':'Đã ngừng hoạt động'} ${entityLabels[entity]}.`);
}

function showToast(message) {
  const toast=document.querySelector('#toast');
  toast.textContent=message;
  toast.style.display='block';
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{toast.style.display='none'},3500);
}

function openRegistration(button) {
  opener=button;
  const form=document.querySelector('#enrollment');
  form.querySelector('.form-error').textContent='';
  form.elements.student.innerHTML=`<option value="">Chọn học viên</option>${students.filter(s=>s.status==='Đang hoạt động').map(s=>`<option value="${escapeHTML(s.id)}">${escapeHTML(s.name)} · ${escapeHTML(s.id)}</option>`).join('')}`;
  updateRegistrationClasses();
  registrationDialog.showModal();
}

function updateRegistrationClasses() {
  const form=document.querySelector('#enrollment');
  const studentId=form.elements.student.value;
  const available=classrooms.filter(c=>isOpen(c)&&classSize(c.id)<c.max&&!activeEnrollments(c.id).some(e=>e.studentId===studentId));
  form.elements.classroom.innerHTML=`<option value="">${available.length?'Chọn lớp học':'Không có lớp phù hợp còn chỗ'}</option>${available.map(c=>`<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)} · còn ${c.max-classSize(c.id)} chỗ</option>`).join('')}`;
}

function submitRegistration(event) {
  event.preventDefault();
  const form=event.currentTarget;
  const error=form.querySelector('.form-error');
  const studentId=form.elements.student.value;
  const classId=form.elements.classroom.value;
  const classroom=lookup(classrooms,classId);
  if (!lookup(students,studentId)||lookup(students,studentId).status!=='Đang hoạt động') {
    error.textContent='Học viên không còn hoạt động. Vui lòng chọn hồ sơ khác.';
    return;
  }
  if (!classroom||!isOpen(classroom)||classSize(classId)>=classroom.max) {
    error.textContent='Lớp không còn tuyển hoặc đã đủ sĩ số. Vui lòng chọn lớp khác.';
    updateRegistrationClasses();
    return;
  }
  if (activeEnrollments(classId).some(e=>e.studentId===studentId)) {
    error.textContent='Học viên đã đăng ký lớp này.';
    updateRegistrationClasses();
    return;
  }
  activateEnrollment(studentId,classId);
  registrationDialog.close();
  render();
  showToast('Đăng ký thành công. Sĩ số lớp đã được cập nhật.');
}

function openTransfer(id,button) {
  const enrollment=lookup(enrollments,id);
  if (!enrollment) return;
  opener=button;
  const candidates=classrooms.filter(c=>c.id!==enrollment.classId&&isOpen(c)&&classSize(c.id)<c.max&&!activeEnrollments(c.id).some(e=>e.studentId===enrollment.studentId));
  managementDialog.innerHTML=`<form id="transfer-form" data-id="${escapeHTML(id)}"><div class="section-head"><h2>Chuyển lớp</h2><button type="button" data-close-dialog aria-label="Đóng">×</button></div><p class="muted">Học viên: ${escapeHTML(lookup(students,enrollment.studentId)?.name||enrollment.studentId)}. Đăng ký cũ chỉ được chuyển sau khi xác nhận lớp mới.</p><label>Lớp mới<select name="classId" required>${candidates.map(c=>`<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)} · còn ${c.max-classSize(c.id)} chỗ</option>`).join('')}</select></label><p class="form-error" role="alert">${candidates.length?'':'Không có lớp đang tuyển phù hợp còn chỗ.'}</p><div class="dialog-actions"><button type="button" data-close-dialog>Hủy</button><button class="primary" type="submit" ${candidates.length?'':'disabled'}>Xác nhận chuyển lớp</button></div></form>`;
  managementDialog.showModal();
}

function submitTransfer(form) {
  const old=lookup(enrollments,form.dataset.id);
  const classId=form.elements.classId.value;
  const target=lookup(classrooms,classId);
  const error=form.querySelector('.form-error');
  if (!old||old.status!=='Hiệu lực'||classId===old.classId||lookup(students,old.studentId)?.status!=='Đang hoạt động'||!target||!isOpen(target)||classSize(classId)>=target.max||activeEnrollments(classId).some(e=>e.studentId===old.studentId)) {
    error.textContent='Không thể chuyển: lớp không còn chỗ hoặc học viên đã đăng ký lớp này. Đăng ký cũ vẫn được giữ nguyên.';
    return;
  }
  old.status='Đã chuyển';
  activateEnrollment(old.studentId,classId);
  managementDialog.close();
  render();
  showToast('Đã chuyển học viên sang lớp mới.');
}

content.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if (!button) return;
  if (button.dataset.go) navigate(button.dataset.go);
  else if (button.hasAttribute('data-register')) openRegistration(button);
  else if (button.dataset.add) openEntityForm(button.dataset.add,'',button);
  else if (button.dataset.edit) openEntityForm(button.dataset.edit,button.dataset.id,button);
  else if (button.dataset.toggleStatus) changeStatus(button.dataset.toggleStatus,button.dataset.id);
  else if (button.dataset.roster) {selectedClassId=button.dataset.roster;render()}
  else if (button.hasAttribute('data-clear-roster')) {selectedClassId='';render()}
  else if (button.dataset.cancelEnrollment) {
    const enrollment=lookup(enrollments,button.dataset.cancelEnrollment);
    if(enrollment) askConfirm('Hủy đăng ký lớp','Học viên sẽ được bỏ khỏi danh sách hiệu lực. Bản ghi đăng ký được giữ lại.',()=>{enrollment.status='Hủy';render();showToast('Đã hủy đăng ký.');});
  } else if (button.dataset.transfer) openTransfer(button.dataset.transfer,button);
});

content.addEventListener('input',event=>{
  if (event.target.id==='list-search') {
    const results=document.querySelector('#list-results');
    results.innerHTML=studentRows(event.target.value,document.querySelector('#status-filter').value);
  }
});
content.addEventListener('change',event=>{
  if (event.target.id==='status-filter') {
    document.querySelector('#list-results').innerHTML=studentRows(document.querySelector('#list-search').value,event.target.value);
  }
});

document.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>navigate(button.dataset.page)));
document.querySelector('[data-close-dialog]').addEventListener('click',()=>registrationDialog.close());
registrationDialog.addEventListener('click',event=>{if(event.target===registrationDialog)registrationDialog.close()});
registrationDialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus();else content.focus();});
document.querySelector('#enrollment').addEventListener('submit',submitRegistration);
document.querySelector('#enrollment').elements.student.addEventListener('change',updateRegistrationClasses);
managementDialog.addEventListener('click',event=>{
  if (event.target===managementDialog) managementDialog.close();
  if (event.target.closest('[data-close-dialog]')) managementDialog.close();
});
managementDialog.addEventListener('submit',event=>{
  event.preventDefault();
  if (event.target.id==='entity-form') saveEntity(event.target);
  if (event.target.id==='transfer-form') submitTransfer(event.target);
});
managementDialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus();else content.focus();});
window.addEventListener('hashchange',()=>{page=labels[location.hash.slice(1)]?location.hash.slice(1):'overview';selectedClassId='';render()});
page=labels[location.hash.slice(1)]?location.hash.slice(1):'overview';
render();


function isOpen(c){return c.status==='Đang tuyển'&&!!c.end&&c.end>=today();}
function activateEnrollment(studentId,classId){
  const existing=enrollments.find(e=>e.studentId===studentId&&e.classId===classId);
  if(existing)Object.assign(existing,{status:'Hiệu lực',date:today()});
  else enrollments.push({id:code('DK',enrollments),studentId,classId,date:today(),status:'Hiệu lực'});
}
function validateEntity(entity,v,record){
  if(!v.name.trim())return 'Tên không được chỉ chứa khoảng trắng.';
  if(v.dob&&v.dob>today())return 'Ngày sinh không được ở tương lai.';
  if(entity==='student'&&v.status==='Ngừng hoạt động'&&enrollments.some(e=>e.studentId===record?.id&&e.status==='Hiệu lực'))return 'Hãy hủy hoặc chuyển các đăng ký hiệu lực trước khi ngừng học viên.';
  if(entity==='teacher'&&v.status==='Ngừng hoạt động'&&classrooms.some(c=>c.teacherId===record?.id&&['Đang tuyển','Đang học'].includes(c.status)))return 'Hãy phân công giáo viên khác cho các lớp đang tuyển hoặc đang học trước.';
  if(entity==='classroom'){
    if(!lookup(courses,v.courseId))return 'Vui lòng chọn khóa học hợp lệ.';
    if(v.teacherId&&lookup(teachers,v.teacherId)?.status!=='Đang hoạt động')return 'Giáo viên phải đang hoạt động.';
    if(!Number.isInteger(v.max)||v.max<1)return 'Sĩ số phải là số nguyên dương.';
    if(['Đang tuyển','Đang học'].includes(v.status)&&(!v.start||!v.end||!v.schedule||!v.room))return 'Lớp đang tuyển/đang học cần đủ ngày, lịch học và phòng học.';
    if(v.status==='Đang học'&&!v.teacherId)return 'Phân công giáo viên trước khi bắt đầu lớp.';
    if(record&&v.status==='Đã hủy'&&classSize(record.id))return 'Hủy hoặc chuyển các đăng ký hiệu lực trước khi hủy lớp.';
    if(record&&['Hoàn thành','Đã hủy'].includes(record.status)&&v.status!==record.status)return 'Lớp đã kết thúc không được mở lại trong phiên bản này.';
  }
  return '';
}
function renderLogin(){
  document.body.classList.add('login-mode');
  content.innerHTML=`<section class="login-card"><span class="logo">L</span><p class="eyebrow">LANGUAGE CENTER</p><h1>Chào mừng trở lại.</h1><p class="muted">Một không gian để quản lý lớp học và đồng hành cùng học viên.</p><div class="login-info"><b>Tài khoản trải nghiệm</b><p>Quản trị: <strong>admin.demo</strong> · Nhân viên: <strong>staff.demo</strong><br>Mật khẩu chung: <strong>demo123</strong></p></div><form id="demo-login"><label>Tên đăng nhập<input name="username" autocomplete="off" required placeholder="admin.demo hoặc staff.demo"></label><label>Mật khẩu<input name="password" type="password" autocomplete="off" required placeholder="Mật khẩu trải nghiệm"></label><p class="form-error" role="alert"></p><button class="primary">Đăng nhập →</button></form><small>Đây là giao diện demo, chưa có xác thực server.<br>Chỉ sử dụng tài khoản minh họa được ghi ở trên.</small></section>`;
  document.querySelector('#demo-login').addEventListener('submit',e=>{e.preventDefault();const user=e.target.elements.username.value.trim();if(!['admin.demo','staff.demo'].includes(user)||e.target.elements.password.value!=='demo123'){e.target.querySelector('.form-error').textContent='Tên đăng nhập hoặc mật khẩu demo chưa đúng.';return;}demoSession={role:user==='admin.demo'?'Admin':'Staff'};render();document.querySelector('#content').focus();});
}
function renderProfile(){
  content.innerHTML=pageIntro('Thông tin tài khoản và phiên làm việc hiện tại.')+`<section class="panel account-panel"><span class="avatar">${demoSession.role==='Admin'?'AD':'NV'}</span><h2>${demoSession.role==='Admin'?'Quản trị trung tâm':'Nhân viên trung tâm'}</h2><dl><dt>Tên đăng nhập</dt><dd>${demoSession.role==='Admin'?'admin.demo':'staff.demo'}</dd><dt>Vai trò</dt><dd>${demoSession.role==='Admin'?'Quản trị viên':'Nhân viên'}</dd><dt>Trạng thái</dt><dd>${statusBadge('Đang hoạt động')}</dd></dl><p class="muted">Bạn đang sử dụng phiên trải nghiệm. Đăng nhập và đổi mật khẩu thực sẽ được kết nối với backend.</p><button id="logout">Đăng xuất khỏi phiên</button></section>`;
  document.querySelector('#logout').onclick=()=>askConfirm('Đăng xuất','Kết thúc phiên trải nghiệm? Dữ liệu vẫn giữ đến khi tải lại trang.',()=>{demoSession=false;render();});
}
function askConfirm(title,message,action){
  const d=document.querySelector('#confirm-dialog');const prior=document.activeElement;
  d.innerHTML=`<h2 id="confirm-title">${escapeHTML(title)}</h2><p>${escapeHTML(message)}</p><div class="dialog-actions"><button id="confirm-no">Quay lại</button><button class="primary" id="confirm-yes">Xác nhận</button></div>`;
  d.querySelector('#confirm-no').onclick=()=>d.close();d.querySelector('#confirm-yes').onclick=()=>{d.close();action();};d.onclose=()=>{if(prior?.isConnected)prior.focus();else content.focus();};d.showModal();d.querySelector('#confirm-no').focus();
}
function showDetails(entity,id,button){
  const record=lookup(entities[entity],id);if(!record)return;opener=button;
  managementDialog.innerHTML=`<div class="section-head"><h2>Chi tiết ${entityLabels[entity]}</h2><button data-close-dialog aria-label="Đóng">×</button></div><p class="eyebrow">${escapeHTML(id)}</p><dl class="detail-list">${fieldConfigs[entity].map(f=>{let value=record[f.name];if(f.source)value=lookup(f.source==='courses'?courses:teachers,value)?.name||'Chưa phân công';if(f.type==='date')value=dateText(value);if(f.name==='fee')value=money(value);return `<dt>${f.label}</dt><dd>${escapeHTML(value||'Chưa cập nhật')}</dd>`;}).join('')}</dl>`;managementDialog.showModal();
}
function deleteRecord(entity,id){
  if(demoSession.role!=='Admin'){showToast('Chỉ quản trị viên có thể xóa hồ sơ.');return;}
  const dependent=entity==='student'?enrollments.some(e=>e.studentId===id):entity==='teacher'?classrooms.some(c=>c.teacherId===id):entity==='course'?classrooms.some(c=>c.courseId===id):enrollments.some(e=>e.classId===id);
  if(dependent){showToast('Không thể xóa: hồ sơ có dữ liệu liên quan. Hãy cập nhật trạng thái nếu phù hợp.');return;}
  askConfirm(`Xóa ${entityLabels[entity]}`,`Xóa ${lookup(entities[entity],id)?.name}? Thao tác này áp dụng cho dữ liệu minh họa.`,()=>{const list=entities[entity];list.splice(list.findIndex(r=>r.id===id),1);render();showToast('Đã xóa bản ghi.');});
}
function enhancePage(){
  document.title=`${labels[page]} · Language Center`;
  document.querySelector('.profile b').textContent=demoSession.role==='Admin'?'Quản trị trung tâm':'Nhân viên trung tâm';
  content.querySelectorAll('[data-edit]').forEach(b=>{
    const detail=document.createElement('button');detail.textContent='Chi tiết';detail.onclick=()=>showDetails(b.dataset.edit,b.dataset.id,detail);b.before(detail);
    if(demoSession.role==='Admin'){const del=document.createElement('button');del.textContent='Xóa';del.className='danger-button';del.onclick=()=>deleteRecord(b.dataset.edit,b.dataset.id);b.after(del);}
  });
  if(['teachers','courses','classes','enroll'].includes(page)){
    const toolbar=document.createElement('div');toolbar.className='toolbar';toolbar.innerHTML=`<input aria-label="Tìm trong danh sách" placeholder="Tìm tên, mã hoặc thông tin trong danh sách…"><button>Xóa tìm kiếm</button><span class="muted result-count"></span>`;
    content.querySelector('.intro').after(toolbar);const rows=[...content.querySelectorAll('.panel > .table-wrap > table > tbody > tr')];
    const filter=()=>{const q=normalize(toolbar.querySelector('input').value);let count=0;rows.forEach(r=>{r.hidden=!normalize(r.textContent).includes(q);if(!r.hidden)count++;});toolbar.querySelector('.result-count').textContent=`${count} / ${rows.length} bản ghi`;};toolbar.querySelector('input').oninput=filter;toolbar.querySelector('button').onclick=()=>{toolbar.querySelector('input').value='';filter();};filter();
  }
  if(page==='reports'){
    const panel=document.createElement('section');panel.className='panel class-report';panel.innerHTML=`<h2>Học viên theo lớp</h2><div class="table-wrap"><table><thead><tr><th>Lớp học</th><th>Hiệu lực</th><th>Sức chứa</th><th>Tỷ lệ lấp đầy</th></tr></thead><tbody>${classrooms.map(c=>`<tr><td>${escapeHTML(c.name)}</td><td>${classSize(c.id)}</td><td>${c.max}</td><td><div class="report-meter"><i style="width:${Math.min(100,classSize(c.id)/c.max*100)}%"></i></div>${Math.round(classSize(c.id)/c.max*100)}%</td></tr>`).join('')}</tbody></table></div>`;content.append(panel);
  }
}
