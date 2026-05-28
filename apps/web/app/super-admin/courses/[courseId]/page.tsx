'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { apiFetch, getToken, logout } from '../../../lib/auth';
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ── Types ─────────────────────────────────────────────────
type Tenant = { id: string; name: string };
type Lesson = { id: string; title: string; type: string; order_index: number };
type TextBlock  = { id: string; type: 'text';  content_en: any; content_hi: any; content_mr: any };
type VideoBlock = { id: string; type: 'video'; url: string; title: string; source: 'youtube'|'upload' };
type QuizQ      = { id: string; qtype: 'mcq'|'truefalse'; text: string; options: string[]; correct: number; points: number };
type QuizBlock  = { id: string; type: 'quiz';  title: string; questions: QuizQ[]; pass_score: number };
type LabBlock   = { id: string; type: 'lab';   wokwi_url: string; instructions: string };
type Block = TextBlock | VideoBlock | QuizBlock | LabBlock;

const CATS = ['Arduino','Raspberry Pi','ARM','RISC-V','ESP32','Sensors','Electronics','IoT','Artificial Intelligence','General'];
const LVLS = ['beginner','intermediate','advanced'];
const LESSON_TYPES: Record<string,{emoji:string;color:string;label:string}> = {
  text:{emoji:'📖',color:'#00C896',label:'Text'},
  quiz:{emoji:'📝',color:'#FF6B35',label:'Quiz'},
  lab: {emoji:'🔬',color:'#A855F7',label:'Lab'},
};
const BLOCK_ADD = [
  {type:'text',  emoji:'📖', label:'Text Block',       color:'#00C896'},
  {type:'video', emoji:'🎬', label:'Video Block',      color:'#1A73E8'},
  {type:'quiz',  emoji:'📝', label:'Quiz Block',       color:'#FF6B35'},
  {type:'lab',   emoji:'🔬', label:'Lab Simulation',   color:'#A855F7'},
];

const L:React.CSSProperties={display:'block',fontSize:'0.68rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4};
const I:React.CSSProperties={display:'block',width:'100%',padding:'0.55rem 0.75rem',borderRadius:7,border:'1.5px solid #d1d5db',fontSize:'0.875rem',fontFamily:'inherit',boxSizing:'border-box',outline:'none'};

function uid(){return Math.random().toString(36).slice(2,9);}
function slugify(t:string){return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function emptyText():TextBlock{return{id:uid(),type:'text',content_en:null,content_hi:null,content_mr:null};}
function emptyVideo():VideoBlock{return{id:uid(),type:'video',url:'',title:'',source:'youtube'};}
function emptyQuiz():QuizBlock{return{id:uid(),type:'quiz',title:'Knowledge Check',questions:[],pass_score:60};}
function emptyLab():LabBlock{return{id:uid(),type:'lab',wokwi_url:'',instructions:''};}

// ── Sortable chapter row ───────────────────────────────────
function SortableLesson({lesson,index,isActive,onSelect,onDelete}:{lesson:Lesson;index:number;isActive:boolean;onSelect:()=>void;onDelete:()=>void}){
  const{attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id:lesson.id});
  const meta=LESSON_TYPES[lesson.type]||{emoji:'📄',color:'#718096',label:lesson.type};
  return(
    <div ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition,opacity:isDragging?0.35:1}}>
      <div onClick={onSelect} style={{padding:'0.6rem 0.875rem',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer',background:isActive?meta.color+'0e':'transparent',borderLeft:isActive?`3px solid ${meta.color}`:'3px solid transparent'}}
        onMouseEnter={e=>{if(!isActive)(e.currentTarget as HTMLDivElement).style.background='#f8fafc';}}
        onMouseLeave={e=>{if(!isActive)(e.currentTarget as HTMLDivElement).style.background='transparent';}}>
        <span {...attributes}{...listeners} onClick={e=>e.stopPropagation()} style={{cursor:'grab',color:'#cbd5e1',fontSize:'0.85rem',flexShrink:0}}>⠿</span>
        <div style={{width:22,height:22,borderRadius:'50%',background:isActive?meta.color:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.62rem',flexShrink:0,color:isActive?'#fff':'#6b7280',fontWeight:700}}>{index+1}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:'0.8rem',fontWeight:isActive?700:600,color:isActive?'#1e293b':'#374151',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{lesson.title}</div>
          <div style={{fontSize:'0.62rem',color:meta.color,fontWeight:700,marginTop:1}}>{meta.emoji} {meta.label}</div>
        </div>
        <button onClick={e=>{e.stopPropagation();onDelete();}} style={{padding:'2px 5px',border:'none',background:'transparent',color:'#cbd5e1',fontSize:'0.68rem',cursor:'pointer'}} onMouseEnter={e=>(e.currentTarget.style.color='#DC2626')} onMouseLeave={e=>(e.currentTarget.style.color='#cbd5e1')}>✕</button>
      </div>
    </div>
  );
}

// ── TipTap toolbar ─────────────────────────────────────────
function Toolbar({editor}:{editor:any}){
  if(!editor)return null;
  const B=(fn:()=>void,lbl:string,active?:boolean)=>(
    <button onMouseDown={e=>{e.preventDefault();fn();}} style={{padding:'3px 7px',border:'1px solid',borderColor:active?'#1A73E8':'#e2e8f0',borderRadius:4,background:active?'#EFF6FF':'#fff',color:active?'#1A73E8':'#374151',fontSize:'0.75rem',fontWeight:active?700:500,cursor:'pointer'}}>{lbl}</button>
  );
  return(
    <div style={{display:'flex',gap:'0.25rem',padding:'0.5rem 0.875rem',borderBottom:'1px solid #e2e8f0',background:'#f8fafc',flexWrap:'wrap'}}>
      {B(()=>editor.chain().focus().toggleBold().run(),'B',editor.isActive('bold'))}
      {B(()=>editor.chain().focus().toggleItalic().run(),'I',editor.isActive('italic'))}
      {B(()=>editor.chain().focus().toggleHeading({level:1}).run(),'H1',editor.isActive('heading',{level:1}))}
      {B(()=>editor.chain().focus().toggleHeading({level:2}).run(),'H2',editor.isActive('heading',{level:2}))}
      {B(()=>editor.chain().focus().toggleHeading({level:3}).run(),'H3',editor.isActive('heading',{level:3}))}
      {B(()=>editor.chain().focus().toggleBulletList().run(),'• List',editor.isActive('bulletList'))}
      {B(()=>editor.chain().focus().toggleOrderedList().run(),'1. List',editor.isActive('orderedList'))}
      {B(()=>editor.chain().focus().toggleCodeBlock().run(),'Code',editor.isActive('codeBlock'))}
      {B(()=>editor.chain().focus().toggleBlockquote().run(),'Quote',editor.isActive('blockquote'))}
      <span style={{borderLeft:'1px solid #e2e8f0',margin:'0 3px'}}/>
      {B(()=>editor.chain().focus().undo().run(),'↩')}
      {B(()=>editor.chain().focus().redo().run(),'↪')}
    </div>
  );
}

// ── Block card wrapper ─────────────────────────────────────
function BlockCard({block,isEditing,onEdit,onDelete,children}:{block:Block;isEditing:boolean;onEdit:()=>void;onDelete:()=>void;children:React.ReactNode}){
  const meta={text:{emoji:'📖',color:'#00C896',label:'Text'},video:{emoji:'🎬',color:'#1A73E8',label:'Video'},quiz:{emoji:'📝',color:'#FF6B35',label:'Quiz'},lab:{emoji:'🔬',color:'#A855F7',label:'Lab'}}[block.type]||{emoji:'📄',color:'#718096',label:block.type};
  return(
    <div style={{background:'#fff',borderRadius:12,border:`1.5px solid ${isEditing?meta.color:'#e2e8f0'}`,overflow:'hidden',marginBottom:'1rem',boxShadow:isEditing?`0 0 0 3px ${meta.color}22`:'0 1px 4px rgba(0,0,0,0.04)'}}>
      <div style={{padding:'0.65rem 1rem',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',justifyContent:'space-between',background:isEditing?meta.color+'0a':'#fafafa'}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:'0.3rem',fontSize:'0.72rem',fontWeight:700,color:meta.color}}>{meta.emoji} {meta.label}</span>
        <div style={{display:'flex',gap:'0.4rem'}}>
          <button onClick={onEdit} style={{padding:'3px 10px',borderRadius:5,border:'1.5px solid',borderColor:isEditing?meta.color:'#e2e8f0',background:isEditing?meta.color+'18':'#fff',color:isEditing?meta.color:'#6b7280',fontSize:'0.72rem',fontWeight:700,cursor:'pointer'}}>{isEditing?'✓ Done':'Edit'}</button>
          <button onClick={onDelete} style={{padding:'3px 8px',borderRadius:5,border:'1.5px solid #fecaca',background:'#FFF5F5',color:'#DC2626',fontSize:'0.72rem',fontWeight:700,cursor:'pointer'}}>✕</button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function CourseEditorPage(){
  const params=useParams();
  const courseId=params.courseId as string;
  const isNew=courseId==='new';

  const [tenants,setTenants]=useState<Tenant[]>([]);
  const [createdId,setCreatedId]=useState<string|null>(null);
  const activeCourseId=createdId||(isNew?null:courseId);

  const [form,setForm]=useState({title_en:'',title_hi:'',title_mr:'',description_en:'',slug:'',category:'General',level:'beginner',status:'draft',tenant_id:''});
  const [fSaving,setFSaving]=useState(false);
  const [fMsg,setFMsg]=useState('');
  const [fErr,setFErr]=useState('');

  const [lessons,setLessons]=useState<Lesson[]>([]);
  const [activeLesson,setActiveLesson]=useState<Lesson|null>(null);
  const [addingLesson,setAddingLesson]=useState(false);
  const [newTitle,setNewTitle]=useState('');
  const [newType,setNewType]=useState('text');

  // Multi-block state
  const [blocks,setBlocks]=useState<Block[]>([]);
  const [editingBlockId,setEditingBlockId]=useState<string|null>(null);
  const [textLocale,setTextLocale]=useState<'en'|'hi'|'mr'>('en');
  const [contentRecordId,setContentRecordId]=useState<string|null>(null);
  const [saving,setSaving]=useState(false);
  const [saveMsg,setSaveMsg]=useState('');
  const [autoStatus,setAutoStatus]=useState<''|'unsaved'|'saving'|'saved'>('');
  const autoTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const activeTextBlockRef=useRef<string|null>(null);

  // Video upload
  const [uploading,setUploading]=useState<string|null>(null);

  // TipTap (shared across text blocks)
  const editor=useEditor({
    immediatelyRender:false,
    extensions:[StarterKit,Placeholder.configure({placeholder:'Write your lesson content here...'})],
    content:'',
    onUpdate:({editor})=>{
      const bid=activeTextBlockRef.current;
      if(!bid)return;
      const locale=textLocale;
      setBlocks(prev=>prev.map(b=>b.id===bid?{...b,[`content_${locale}`]:editor.getJSON()} as TextBlock:b));
      scheduleAutoSave();
    },
  });

  const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:5}}),useSensor(KeyboardSensor,{coordinateGetter:sortableKeyboardCoordinates}));

  function scheduleAutoSave(){
    setAutoStatus('unsaved');
    if(autoTimer.current)clearTimeout(autoTimer.current);
    autoTimer.current=setTimeout(()=>doSave(true),2000);
  }

  useEffect(()=>{
    apiFetch('/api/tenants').then(r=>r.json()).then(d=>{const l=Array.isArray(d)?d:[];setTenants(l);if(isNew&&l.length>0)setForm(f=>({...f,tenant_id:l[0].id}));}).catch(()=>{});
    if(!isNew){
      apiFetch(`/api/courses/${courseId}`).then(r=>r.json()).then(d=>{if(d?.id)setForm({title_en:d.title_en||'',title_hi:d.title_hi||'',title_mr:d.title_mr||'',description_en:d.description_en||'',slug:d.slug||'',category:d.category||'General',level:d.level||'beginner',status:d.status||'draft',tenant_id:d.tenant_id||''}); }).catch(()=>{});
      loadLessons(courseId);
    }
  },[courseId]);

  function loadLessons(cid:string){
    apiFetch(`/api/lessons/course/${cid}`).then(r=>r.json()).then(d=>setLessons((Array.isArray(d)?d:[]).sort((a:Lesson,b:Lesson)=>a.order_index-b.order_index))).catch(()=>{});
  }

  async function saveCourse(){
    if(!form.title_en.trim()){setFErr('Title required.');return;}
    setFSaving(true);setFErr('');setFMsg('');
    const p={title_en:form.title_en,title_hi:form.title_hi||undefined,title_mr:form.title_mr||undefined,description_en:form.description_en||undefined,slug:form.slug||slugify(form.title_en),category:form.category,level:form.level,status:form.status};
    try{
      if(isNew&&!createdId){const r=await apiFetch('/api/courses',{method:'POST',body:JSON.stringify(p)});if(r.ok){const d=await r.json();setCreatedId(d.id);setFMsg('Course created!');}else{const e=await r.json();setFErr(e.message||'Failed.');}}
      else{const r=await apiFetch(`/api/courses/${activeCourseId}`,{method:'PATCH',body:JSON.stringify(p)});if(r.ok)setFMsg('Saved!');else{const e=await r.json();setFErr(e.message||'Failed.');}}
    }catch{setFErr('Network error.');}
    finally{setFSaving(false);setTimeout(()=>{setFMsg('');setFErr('');},3000);}
  }

  async function addLesson(){
    if(!newTitle.trim()||!activeCourseId)return;
    const r=await apiFetch('/api/lessons',{method:'POST',body:JSON.stringify({course_id:activeCourseId,title:newTitle,type:newType,order_index:lessons.length})});
    if(r.ok){const l=await r.json();setLessons(p=>[...p,l]);setNewTitle('');setAddingLesson(false);selectLesson(l);}
  }

  async function deleteLesson(id:string){
    if(!confirm('Delete this chapter?'))return;
    await apiFetch(`/api/lessons/${id}`,{method:'DELETE'});
    setLessons(p=>p.filter(l=>l.id!==id));
    if(activeLesson?.id===id){setActiveLesson(null);setBlocks([]);}
  }

  async function handleDragEnd(e:DragEndEvent){
    const{active,over}=e;
    if(!over||active.id===over.id)return;
    const oi=lessons.findIndex(l=>l.id===active.id),ni=lessons.findIndex(l=>l.id===over.id);
    const r=arrayMove(lessons,oi,ni).map((l,i)=>({...l,order_index:i}));
    setLessons(r);
    await Promise.all(r.map(l=>apiFetch(`/api/lessons/${l.id}`,{method:'PATCH',body:JSON.stringify({order_index:l.order_index})})));
  }

  function selectLesson(lesson:Lesson){
    setActiveLesson(lesson);
    setBlocks([]);setEditingBlockId(null);setContentRecordId(null);setAutoStatus('');
    editor?.commands.setContent('');
    activeTextBlockRef.current=null;
    apiFetch(`/api/lesson-content/lesson/${lesson.id}`).then(r=>r.json()).then((data:any[])=>{
      if(Array.isArray(data)&&data.length>0){
        const en=data.find(c=>c.locale==='en');
        if(en){
          setContentRecordId(en.id);
          const json=en.content_json;
          // Parse blocks format or legacy
          if(json?.format==='blocks_v1'){
            const parsed:Block[]=json.blocks||[];
            setBlocks(parsed);
          } else if(json) {
            // Legacy: wrap in a single text block
            const tb:TextBlock={id:uid(),type:'text',content_en:json,content_hi:null,content_mr:null};
            setBlocks([tb]);
          } else {
            setBlocks([emptyText()]);
          }
        } else {
          setBlocks([emptyText()]);
        }
      } else {
        setBlocks([emptyText()]);
      }
    }).catch(()=>setBlocks([emptyText()]));
  }

  function openBlock(bid:string){
    setEditingBlockId(prev=>prev===bid?null:bid);
    const block=blocks.find(b=>b.id===bid);
    if(block?.type==='text'){
      activeTextBlockRef.current=bid;
      const tb=block as TextBlock;
      const content=textLocale==='en'?tb.content_en:textLocale==='hi'?tb.content_hi:tb.content_mr;
      editor?.commands.setContent(content||'');
    }
  }

  function addBlock(type:string){
    let b:Block;
    if(type==='text')b=emptyText();
    else if(type==='video')b=emptyVideo();
    else if(type==='quiz')b=emptyQuiz();
    else b=emptyLab();
    setBlocks(p=>[...p,b]);
    setTimeout(()=>openBlock(b.id),50);
  }

  function updateBlock(id:string,patch:Partial<Block>){
    setBlocks(p=>p.map(b=>b.id===id?{...b,...patch}:b));
    scheduleAutoSave();
  }

  function deleteBlock(id:string){
    if(!confirm('Remove this block?'))return;
    setBlocks(p=>p.filter(b=>b.id!==id));
    if(editingBlockId===id)setEditingBlockId(null);
    scheduleAutoSave();
  }

  async function doSave(auto=false){
    if(!activeLesson)return;
    if(auto)setAutoStatus('saving');else setSaving(true);
    const payload={format:'blocks_v1',blocks};
    try{
      await apiFetch('/api/lesson-content',{method:'POST',body:JSON.stringify({lesson_id:activeLesson.id,locale:'en',content_json:payload,status:'published'})});
      if(auto){setAutoStatus('saved');setTimeout(()=>setAutoStatus(''),3000);}
      else{setSaveMsg('Chapter saved!');setTimeout(()=>setSaveMsg(''),2500);}
    }catch{if(auto)setAutoStatus('unsaved');else setSaveMsg('Error saving.');}
    finally{if(!auto)setSaving(false);}
  }

  // Video upload
  async function uploadVideo(blockId:string,file:File){
    setUploading(blockId);
    const fd=new FormData();fd.append('file',file);
    const token=getToken();
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001'}/api/upload/file`,{method:'POST',headers:{Authorization:`Bearer ${token}`},body:fd});
    if(res.ok){const d=await res.json();updateBlock(blockId,{url:d.url,source:'upload'} as Partial<VideoBlock>);}
    setUploading(null);
  }

  // Quiz helpers
  function addQuestion(blockId:string){
    const newQ:QuizQ={id:uid(),qtype:'mcq',text:'',options:['','','',''],correct:0,points:10};
    setBlocks(p=>p.map(b=>b.id===blockId&&b.type==='quiz'?{...b,questions:[...(b as QuizBlock).questions,newQ]}:b));
  }
  function updateQuestion(blockId:string,qid:string,patch:Partial<QuizQ>){
    setBlocks(p=>p.map(b=>b.id===blockId&&b.type==='quiz'?{...b,questions:(b as QuizBlock).questions.map(q=>q.id===qid?{...q,...patch}:q)}:b));
  }
  function removeQuestion(blockId:string,qid:string){
    setBlocks(p=>p.map(b=>b.id===blockId&&b.type==='quiz'?{...b,questions:(b as QuizBlock).questions.filter(q=>q.id!==qid)}:b));
  }

  // Locale switch for text block
  useEffect(()=>{
    const bid=editingBlockId;
    if(!bid)return;
    const block=blocks.find(b=>b.id===bid);
    if(block?.type==='text'){
      activeTextBlockRef.current=bid;
      const tb=block as TextBlock;
      const content=textLocale==='en'?tb.content_en:textLocale==='hi'?tb.content_hi:tb.content_mr;
      editor?.commands.setContent(content||'');
    }
  },[textLocale]);

  const phaseOk=!isNew||!!createdId;

  return(
    <>
      <style>{`
        .ProseMirror{outline:none;min-height:280px;padding:1.1rem 1.25rem;font-size:0.9rem;line-height:1.8;color:#1e293b;}
        .ProseMirror p{margin-bottom:0.75rem;}
        .ProseMirror h1{font-size:1.5rem;font-weight:800;margin:1.25rem 0 0.5rem;color:#0f172a;}
        .ProseMirror h2{font-size:1.2rem;font-weight:700;margin:1rem 0 0.4rem;color:#0f172a;}
        .ProseMirror h3{font-size:1rem;font-weight:700;margin:0.875rem 0 0.35rem;}
        .ProseMirror ul,.ProseMirror ol{padding-left:1.4rem;margin-bottom:0.75rem;}
        .ProseMirror li{margin-bottom:0.25rem;}
        .ProseMirror pre{background:#1e293b;color:#e2e8f0;padding:1rem 1.1rem;border-radius:9px;font-family:'Courier New',monospace;font-size:0.85rem;line-height:1.6;margin-bottom:0.875rem;overflow-x:auto;}
        .ProseMirror code{background:#f1f5f9;color:#0f172a;padding:1px 5px;border-radius:3px;font-size:0.85em;}
        .ProseMirror pre code{background:transparent;color:inherit;padding:0;}
        .ProseMirror blockquote{border-left:4px solid #1A73E8;padding-left:0.875rem;color:#475569;margin:0.6rem 0;}
        .ProseMirror p.is-editor-empty:first-child::before{content:attr(data-placeholder);float:left;color:#94a3b8;pointer-events:none;height:0;}
      `}</style>

      <div style={{height:'100vh',display:'flex',flexDirection:'column',fontFamily:'system-ui,sans-serif',background:'#f1f5f9'}}>
        {/* TOPBAR */}
        <nav style={{background:'#1e1e3f',padding:'0 1.25rem',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',minWidth:0}}>
            <Link href="/super-admin" style={{display:'flex',alignItems:'center',gap:'0.3rem',textDecoration:'none',flexShrink:0}}>
              <div style={{width:24,height:24,background:'linear-gradient(135deg,#1A73E8,#00C896)',borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem'}}>🚀</div>
              <span style={{fontWeight:800,fontSize:'0.9rem',color:'#fff'}}>SimuLearning</span>
            </Link>
            <span style={{color:'#475569'}}>/</span>
            <Link href="/super-admin/courses" style={{color:'#94a3b8',fontSize:'0.78rem',textDecoration:'none'}}>Courses</Link>
            <span style={{color:'#475569'}}>/</span>
            <span style={{color:'#e2e8f0',fontSize:'0.78rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:180}}>{isNew?'New Course':form.title_en||'Edit'}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'0.45rem',flexShrink:0}}>
            {autoStatus==='saving'&&<span style={{fontSize:'0.7rem',color:'#94a3b8'}}>Saving…</span>}
            {autoStatus==='saved'&&<span style={{fontSize:'0.7rem',color:'#00C896'}}>✓ Autosaved</span>}
            {autoStatus==='unsaved'&&<span style={{fontSize:'0.7rem',color:'#FFD93D'}}>● Unsaved</span>}
            <button onClick={()=>setForm(f=>({...f,status:f.status==='published'?'draft':'published'}))}
              style={{padding:'4px 10px',borderRadius:5,border:'none',fontWeight:700,fontSize:'0.7rem',cursor:'pointer',background:form.status==='published'?'#DCFCE7':'rgba(255,255,255,0.1)',color:form.status==='published'?'#15803D':'#94a3b8'}}>
              {form.status==='published'?'🟢 Published':'📝 Draft'}
            </button>
            <button onClick={saveCourse} disabled={fSaving} style={{padding:'5px 14px',borderRadius:5,background:'linear-gradient(135deg,#1A73E8,#00C896)',color:'#fff',border:'none',fontWeight:700,fontSize:'0.78rem',cursor:'pointer'}}>{fSaving?'Saving…':'💾 Save Course'}</button>
            <button onClick={logout} style={{padding:'4px 8px',borderRadius:5,background:'rgba(255,255,255,0.07)',color:'#94a3b8',border:'none',fontSize:'0.7rem',cursor:'pointer'}}>Sign Out</button>
          </div>
        </nav>

        <div style={{flex:1,display:'flex',overflow:'hidden'}}>
          {/* SIDEBAR */}
          <aside style={{width:264,background:'#fff',borderRight:'1px solid #e2e8f0',display:'flex',flexDirection:'column',flexShrink:0,overflowY:'auto'}}>
            <div style={{padding:'0.875rem',borderBottom:'1px solid #e2e8f0'}}>
              <div style={{fontSize:'0.6rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.65rem'}}>Course Info</div>
              {fMsg&&<div style={{background:'#DCFCE7',color:'#15803D',padding:'0.3rem 0.55rem',borderRadius:5,fontSize:'0.72rem',fontWeight:600,marginBottom:6}}>✅ {fMsg}</div>}
              {fErr&&<div style={{background:'#FEE2E2',color:'#DC2626',padding:'0.3rem 0.55rem',borderRadius:5,fontSize:'0.72rem',fontWeight:600,marginBottom:6}}>❌ {fErr}</div>}
              <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                {isNew&&<div><label style={L}>School</label><select value={form.tenant_id} onChange={e=>setForm(f=>({...f,tenant_id:e.target.value}))} style={I}>{tenants.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>}
                <div><label style={L}>Title (English) *</label><input value={form.title_en} onChange={e=>setForm(f=>({...f,title_en:e.target.value,slug:slugify(e.target.value)}))} placeholder="Course title" style={I}/></div>
                <div><label style={L}>हिंदी Title</label><input value={form.title_hi} onChange={e=>setForm(f=>({...f,title_hi:e.target.value}))} placeholder="हिंदी शीर्षक" style={{...I,fontFamily:'Noto Sans Devanagari'}}/></div>
                <div><label style={L}>मराठी Title</label><input value={form.title_mr} onChange={e=>setForm(f=>({...f,title_mr:e.target.value}))} placeholder="मराठी शीर्षक" style={{...I,fontFamily:'Noto Sans Devanagari'}}/></div>
                <div><label style={L}>Description</label><textarea value={form.description_en} onChange={e=>setForm(f=>({...f,description_en:e.target.value}))} placeholder="Short description..." rows={2} style={{...I,resize:'vertical',lineHeight:1.5}}/></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.35rem'}}>
                  <div><label style={L}>Category</label><select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={I}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                  <div><label style={L}>Level</label><select value={form.level} onChange={e=>setForm(f=>({...f,level:e.target.value}))} style={I}>{LVLS.map(l=><option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}</select></div>
                </div>
              </div>
            </div>
            <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
              <div style={{padding:'0.7rem 0.875rem 0.35rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
                <span style={{fontSize:'0.6rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.07em'}}>Chapters ({lessons.length})</span>
                {phaseOk&&<button onClick={()=>setAddingLesson(true)} style={{padding:'2px 7px',borderRadius:4,background:'#EFF6FF',color:'#1A73E8',border:'none',fontSize:'0.68rem',fontWeight:700,cursor:'pointer'}}>+ Add</button>}
              </div>
              {!phaseOk&&<p style={{padding:'0.5rem 0.875rem',color:'#94a3b8',fontSize:'0.73rem',textAlign:'center'}}>Save course first.</p>}
              {addingLesson&&(
                <div style={{padding:'0.6rem 0.875rem',borderBottom:'1px solid #e2e8f0',background:'#f8fafc',flexShrink:0}}>
                  <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Chapter title..." style={{...I,marginBottom:5}} autoFocus onKeyDown={e=>e.key==='Enter'&&addLesson()}/>
                  <div style={{display:'flex',gap:'0.25rem',marginBottom:5,flexWrap:'wrap'}}>
                    {Object.entries(LESSON_TYPES).map(([t,m])=>(
                      <button key={t} onClick={()=>setNewType(t)} style={{padding:'2px 7px',borderRadius:4,border:'1.5px solid',borderColor:newType===t?m.color:'#e2e8f0',background:newType===t?m.color+'18':'#fff',color:newType===t?m.color:'#6b7280',fontSize:'0.65rem',fontWeight:700,cursor:'pointer'}}>{m.emoji} {m.label}</button>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:'0.3rem'}}>
                    <button onClick={addLesson} style={{flex:1,padding:'4px',borderRadius:4,background:'#1A73E8',color:'#fff',border:'none',fontWeight:700,fontSize:'0.7rem',cursor:'pointer'}}>Add</button>
                    <button onClick={()=>{setAddingLesson(false);setNewTitle('');}} style={{padding:'4px 7px',borderRadius:4,border:'1.5px solid #e2e8f0',background:'#fff',color:'#6b7280',fontSize:'0.7rem',cursor:'pointer'}}>✕</button>
                  </div>
                </div>
              )}
              <div style={{flex:1,overflowY:'auto'}}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={lessons.map(l=>l.id)} strategy={verticalListSortingStrategy}>
                    {lessons.map((l,i)=><SortableLesson key={l.id} lesson={l} index={i} isActive={activeLesson?.id===l.id} onSelect={()=>selectLesson(l)} onDelete={()=>deleteLesson(l.id)}/>)}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <main style={{flex:1,overflowY:'auto',padding:'1.25rem 1.5rem'}}>
            {!phaseOk?(
              <div style={{maxWidth:480,margin:'5rem auto',textAlign:'center'}}>
                <div style={{fontSize:'3rem',marginBottom:'0.75rem'}}>📚</div>
                <h2 style={{fontWeight:800,color:'#1e293b',marginBottom:'0.5rem'}}>Fill in course details</h2>
                <p style={{color:'#64748b',marginBottom:'1.25rem'}}>Complete the info on the left and save to start adding chapters.</p>
                <button onClick={saveCourse} style={{padding:'0.65rem 1.75rem',borderRadius:8,background:'linear-gradient(135deg,#1A73E8,#00C896)',color:'#fff',border:'none',fontWeight:700,fontSize:'0.9rem',cursor:'pointer'}}>💾 Save &amp; Continue</button>
              </div>
            ):!activeLesson?(
              <div style={{maxWidth:480,margin:'5rem auto',textAlign:'center'}}>
                <div style={{fontSize:'3rem',marginBottom:'0.75rem'}}>✏️</div>
                <h2 style={{fontWeight:800,color:'#1e293b',marginBottom:'0.5rem'}}>Select a chapter</h2>
                <p style={{color:'#64748b',marginBottom:'1.25rem'}}>Click a chapter on the left to start editing.</p>
                <button onClick={()=>setAddingLesson(true)} style={{padding:'0.65rem 1.75rem',borderRadius:8,background:'linear-gradient(135deg,#1A73E8,#00C896)',color:'#fff',border:'none',fontWeight:700,fontSize:'0.9rem',cursor:'pointer'}}>+ Add First Chapter</button>
              </div>
            ):(
              <div style={{maxWidth:780,margin:'0 auto'}}>
                {/* Chapter header */}
                <div style={{marginBottom:'1rem',paddingBottom:'0.875rem',borderBottom:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'0.5rem'}}>
                  <h1 style={{fontSize:'1.3rem',fontWeight:800,color:'#1e293b',margin:0}}>{activeLesson.title}</h1>
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                    {saveMsg&&<span style={{fontSize:'0.73rem',fontWeight:600,color:saveMsg.includes('Error')?'#DC2626':'#15803D'}}>{saveMsg}</span>}
                    <button onClick={()=>doSave()} disabled={saving} style={{padding:'6px 16px',borderRadius:6,background:'linear-gradient(135deg,#1A73E8,#00C896)',color:'#fff',border:'none',fontWeight:700,fontSize:'0.8rem',cursor:'pointer'}}>{saving?'Saving…':'💾 Save Chapter'}</button>
                  </div>
                </div>

                {/* Blocks */}
                {blocks.map(block=>(
                  <BlockCard key={block.id} block={block} isEditing={editingBlockId===block.id} onEdit={()=>openBlock(block.id)} onDelete={()=>deleteBlock(block.id)}>
                    {/* ── TEXT BLOCK ── */}
                    {block.type==='text'&&editingBlockId===block.id&&(
                      <div>
                        <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',background:'#f8fafc'}}>
                          {(['en','hi','mr']as const).map(l=>(
                            <button key={l} onClick={()=>setTextLocale(l)} style={{flex:1,padding:'0.5rem',border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.75rem',background:textLocale===l?'#fff':'transparent',color:textLocale===l?'#1A73E8':'#6b7280',borderBottom:textLocale===l?'2px solid #1A73E8':'2px solid transparent'}}>
                              {l==='en'?'🇬🇧 EN':l==='hi'?'🇮🇳 HI':'🇮🇳 MR'}
                            </button>
                          ))}
                        </div>
                        <Toolbar editor={editor}/>
                        <EditorContent editor={editor}/>
                      </div>
                    )}
                    {block.type==='text'&&editingBlockId!==block.id&&(
                      <div style={{padding:'0.875rem 1.25rem',color:'#94a3b8',fontSize:'0.82rem'}}>
                        {((block as TextBlock).content_en?.content?.length??0)>0?`${(block as TextBlock).content_en.content.length} content node(s) — click Edit to modify`:'Empty text block — click Edit to write content'}
                      </div>
                    )}

                    {/* ── VIDEO BLOCK ── */}
                    {block.type==='video'&&(
                      <div style={{padding:'1.1rem'}}>
                        <div style={{marginBottom:'0.75rem'}}>
                          <label style={L}>Video Title</label>
                          <input value={(block as VideoBlock).title} onChange={e=>updateBlock(block.id,{title:e.target.value} as Partial<VideoBlock>)} placeholder="e.g. Introduction to ESP32" style={I}/>
                        </div>
                        {editingBlockId===block.id&&(
                          <>
                            <div style={{display:'flex',gap:'0.5rem',marginBottom:'0.875rem'}}>
                              <button onClick={()=>updateBlock(block.id,{source:'youtube'} as Partial<VideoBlock>)} style={{flex:1,padding:'0.5rem',borderRadius:6,border:'1.5px solid',borderColor:(block as VideoBlock).source==='youtube'?'#1A73E8':'#e2e8f0',background:(block as VideoBlock).source==='youtube'?'#EFF6FF':'#fff',color:(block as VideoBlock).source==='youtube'?'#1A73E8':'#6b7280',fontWeight:700,fontSize:'0.78rem',cursor:'pointer'}}>🎬 YouTube / Vimeo URL</button>
                              <button onClick={()=>updateBlock(block.id,{source:'upload'} as Partial<VideoBlock>)} style={{flex:1,padding:'0.5rem',borderRadius:6,border:'1.5px solid',borderColor:(block as VideoBlock).source==='upload'?'#1A73E8':'#e2e8f0',background:(block as VideoBlock).source==='upload'?'#EFF6FF':'#fff',color:(block as VideoBlock).source==='upload'?'#1A73E8':'#6b7280',fontWeight:700,fontSize:'0.78rem',cursor:'pointer'}}>⬆️ Upload Video File</button>
                            </div>
                            {(block as VideoBlock).source==='youtube'?(
                              <div>
                                <label style={L}>Video URL</label>
                                <input value={(block as VideoBlock).url} onChange={e=>updateBlock(block.id,{url:e.target.value} as Partial<VideoBlock>)} placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." style={I}/>
                              </div>
                            ):(
                              <div>
                                <label style={L}>Upload Video File (MP4, WebM)</label>
                                <label htmlFor={`vup_${block.id}`} style={{display:'block',border:'2px dashed #d1d5db',borderRadius:8,padding:'1.5rem',textAlign:'center',background:'#f8fafc',cursor:'pointer'}}>
                                  {uploading===block.id
                                    ?<span style={{color:'#1A73E8',fontWeight:600,fontSize:'0.85rem'}}>⏳ Uploading… please wait</span>
                                    :<span style={{color:'#94a3b8',fontSize:'0.85rem'}}>📁 Click here to select a video file (MP4 / WebM, max 500MB)</span>}
                                  <input id={`vup_${block.id}`} type="file" accept="video/mp4,video/webm" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)uploadVideo(block.id,f);}}/>
                                </label>
                              </div>
                            )}
                          </>
                        )}
                        {(block as VideoBlock).url&&(
                          <div style={{marginTop:'0.75rem',borderRadius:9,overflow:'hidden',aspectRatio:'16/9',background:'#000'}}>
                            {(block as VideoBlock).source==='youtube'&&((block as VideoBlock).url.includes('youtube')||(block as VideoBlock).url.includes('youtu.be'))?(
                              <iframe src={(block as VideoBlock).url.replace('watch?v=','embed/').replace('youtu.be/','youtube.com/embed/')} style={{width:'100%',height:'100%',border:'none'}} allowFullScreen/>
                            ):(block as VideoBlock).source==='upload'?(
                              <video src={(block as VideoBlock).url} controls style={{width:'100%',height:'100%'}}/>
                            ):(
                              <iframe src={(block as VideoBlock).url} style={{width:'100%',height:'100%',border:'none'}} allowFullScreen/>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── QUIZ BLOCK ── */}
                    {block.type==='quiz'&&(
                      <div style={{padding:'1.1rem'}}>
                        {editingBlockId===block.id&&(
                          <div style={{marginBottom:'1rem'}}>
                            <label style={L}>Quiz Title</label>
                            <input value={(block as QuizBlock).title} onChange={e=>updateBlock(block.id,{title:e.target.value} as Partial<QuizBlock>)} style={I}/>
                          </div>
                        )}
                        <div style={{marginBottom:'0.875rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <span style={{fontSize:'0.82rem',fontWeight:600,color:'#374151'}}>{(block as QuizBlock).questions.length} Questions · Pass: {(block as QuizBlock).pass_score}%</span>
                          {editingBlockId===block.id&&<button onClick={()=>addQuestion(block.id)} style={{padding:'4px 12px',borderRadius:6,background:'linear-gradient(135deg,#FF6B35,#ff8c5a)',color:'#fff',border:'none',fontWeight:700,fontSize:'0.75rem',cursor:'pointer'}}>+ Add Question</button>}
                        </div>
                        {(block as QuizBlock).questions.map((q,qi)=>(
                          <div key={q.id} style={{background:'#f8fafc',borderRadius:9,border:'1px solid #e2e8f0',padding:'0.875rem',marginBottom:'0.6rem'}}>
                            {editingBlockId===block.id?(
                              <>
                                <div style={{display:'flex',gap:'0.35rem',marginBottom:'0.6rem',flexWrap:'wrap'}}>
                                  {[{t:'mcq',l:'Multiple Choice'},{t:'truefalse',l:'True / False'}].map(qt=>(
                                    <button key={qt.t} onClick={()=>updateQuestion(block.id,q.id,{qtype:qt.t as any})} style={{padding:'2px 8px',borderRadius:4,border:'1.5px solid',borderColor:q.qtype===qt.t?'#FF6B35':'#e2e8f0',background:q.qtype===qt.t?'#FFF5F0':'#fff',color:q.qtype===qt.t?'#FF6B35':'#6b7280',fontWeight:700,fontSize:'0.68rem',cursor:'pointer'}}>{qt.l}</button>
                                  ))}
                                  <button onClick={()=>removeQuestion(block.id,q.id)} style={{marginLeft:'auto',padding:'2px 7px',borderRadius:4,border:'1.5px solid #fecaca',background:'#FFF5F5',color:'#DC2626',fontSize:'0.68rem',fontWeight:700,cursor:'pointer'}}>✕</button>
                                </div>
                                <input value={q.text} onChange={e=>updateQuestion(block.id,q.id,{text:e.target.value})} placeholder={`Question ${qi+1}`} style={{...I,marginBottom:'0.5rem'}}/>
                                {q.qtype==='mcq'&&q.options.map((opt,oi)=>(
                                  <div key={oi} style={{display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'0.3rem'}}>
                                    <input type="radio" checked={q.correct===oi} onChange={()=>updateQuestion(block.id,q.id,{correct:oi})}/>
                                    <input value={opt} onChange={e=>updateQuestion(block.id,q.id,{options:q.options.map((o,i)=>i===oi?e.target.value:o)})} placeholder={`Option ${String.fromCharCode(65+oi)}`} style={{...I,border:q.correct===oi?'1.5px solid #00C896':'1.5px solid #d1d5db'}}/>
                                  </div>
                                ))}
                                {q.qtype==='truefalse'&&(
                                  <div style={{display:'flex',gap:'0.5rem'}}>
                                    {['True','False'].map((o,oi)=>(
                                      <button key={o} onClick={()=>updateQuestion(block.id,q.id,{correct:oi})} style={{flex:1,padding:'0.45rem',borderRadius:6,border:'2px solid',borderColor:q.correct===oi?'#00C896':'#e2e8f0',background:q.correct===oi?'#DCFCE7':'#fff',color:q.correct===oi?'#15803D':'#374151',fontWeight:700,fontSize:'0.82rem',cursor:'pointer'}}>{o}{q.correct===oi&&' ✓'}</button>
                                    ))}
                                  </div>
                                )}
                                <div style={{display:'flex',alignItems:'center',gap:'0.4rem',marginTop:'0.4rem'}}>
                                  <label style={{...L,margin:0}}>Points:</label>
                                  <input type="number" value={q.points} onChange={e=>updateQuestion(block.id,q.id,{points:parseInt(e.target.value)||10})} style={{...I,width:60}} min="1"/>
                                </div>
                              </>
                            ):(
                              <div style={{fontSize:'0.82rem',color:'#374151',fontWeight:600}}><span style={{color:'#94a3b8',marginRight:6}}>Q{qi+1}.</span>{q.text||'(empty question)'}</div>
                            )}
                          </div>
                        ))}
                        {(block as QuizBlock).questions.length===0&&editingBlockId!==block.id&&(
                          <p style={{color:'#94a3b8',fontSize:'0.8rem',textAlign:'center',padding:'0.5rem'}}>No questions yet — click Edit to add</p>
                        )}
                      </div>
                    )}

                    {/* ── LAB BLOCK ── */}
                    {block.type==='lab'&&(
                      <div style={{padding:'1.1rem'}}>
                        {editingBlockId===block.id&&(
                          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',marginBottom:'0.875rem'}}>
                            <div>
                              <label style={L}>Wokwi Simulation URL</label>
                              <input value={(block as LabBlock).wokwi_url} onChange={e=>updateBlock(block.id,{wokwi_url:e.target.value} as Partial<LabBlock>)} placeholder="https://wokwi.com/projects/..." style={I}/>
                              <div style={{fontSize:'0.68rem',color:'#94a3b8',marginTop:3}}>Build at wokwi.com and paste the share link.</div>
                            </div>
                            <div>
                              <label style={L}>Lab Instructions</label>
                              <textarea value={(block as LabBlock).instructions} onChange={e=>updateBlock(block.id,{instructions:e.target.value} as Partial<LabBlock>)} placeholder="Describe what to build and the learning objectives..." rows={4} style={{...I,resize:'vertical',lineHeight:1.65}}/>
                            </div>
                          </div>
                        )}
                        {(block as LabBlock).wokwi_url?(
                          <div style={{borderRadius:9,overflow:'hidden',aspectRatio:'16/9',background:'#1A1A2E',border:'1px solid #e2e8f0'}}>
                            <iframe src={(block as LabBlock).wokwi_url} style={{width:'100%',height:'100%',border:'none'}} allow="fullscreen"/>
                          </div>
                        ):editingBlockId!==block.id&&(
                          <p style={{color:'#94a3b8',fontSize:'0.8rem',textAlign:'center',padding:'0.5rem'}}>No Wokwi URL set — click Edit to configure</p>
                        )}
                        {(block as LabBlock).instructions&&!editingBlockId&&(
                          <p style={{marginTop:'0.6rem',fontSize:'0.82rem',color:'#475569',lineHeight:1.6}}>{(block as LabBlock).instructions}</p>
                        )}
                      </div>
                    )}
                  </BlockCard>
                ))}

                {/* Add block buttons */}
                <div style={{background:'#fff',borderRadius:12,border:'2px dashed #e2e8f0',padding:'1.25rem',textAlign:'center'}}>
                  <div style={{fontSize:'0.72rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.75rem'}}>Add Content Block</div>
                  <div style={{display:'flex',gap:'0.6rem',justifyContent:'center',flexWrap:'wrap'}}>
                    {BLOCK_ADD.map(b=>(
                      <button key={b.type} onClick={()=>addBlock(b.type)}
                        style={{padding:'0.55rem 1.1rem',borderRadius:8,border:`1.5px solid ${b.color}44`,background:b.color+'0e',color:b.color,fontWeight:700,fontSize:'0.8rem',cursor:'pointer',transition:'all 0.15s'}}
                        onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=b.color+'22';}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=b.color+'0e';}}>
                        {b.emoji} {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
