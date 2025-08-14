import React from 'react'
import { Input } from './ui/input'
import { useDragDrop } from './DraggableContext'
import FontSelector from './FontSelector'
import { Switch } from './ui/switch'

const Options = () => {

    const {setFontOptions,fontOptions}=useDragDrop()
  return (
    <div className='w-full h-full flex flex-col gap-5'>
        <div className='w-full flex justify-between items-center'>
                    <span>colomn bg Colur</span>
                    <Input className='w-24 h-9 cursor-pointer' 
                    onChange={(e)=>{
                        setFontOptions((prev)=>({
                            ...prev,
                            BackgroundColor:e.target.value
                        }))
                    }}
                    value={fontOptions.BackgroundColor}  
                    type="color" name="" id="" />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>Text Color</span>
                      <Input className='w-24 h-9 cursor-pointer' 
                    onChange={(e)=>{
                        setFontOptions((prev)=>({
                            ...prev,
                            primaryColor:e.target.value
                        }))
                    }}
                    value={fontOptions.primaryColor}  
                    type="color" name="" id="" />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>Secondry Color</span>
                      <Input className='w-24 h-9 cursor-pointer' 
                    onChange={(e)=>{
                        setFontOptions((prev)=>({
                            ...prev,
                            secondColor:e.target.value
                        }))
                    }}
                    value={fontOptions.secondColor}  
                    type="color" name="" id="" />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>padding horizontal</span>
                      <Input className='w-24 h-9 cursor-pointer' 
                    onChange={(e)=>{
                        setFontOptions((prev)=>({
                            ...prev,
                            paddingHorizontal:parseInt(e.target.value)
                        }))
                    }}
                    value={fontOptions.paddingHorizontal} 
                    min={6} 
                    type="range" name="" id="" />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>padding Vertical</span>
                      <Input className='w-24 h-9 cursor-pointer' 
                    onChange={(e)=>{
                        setFontOptions((prev)=>({
                            ...prev,
                            paddingVertical:parseInt(e.target.value)
                        }))
                    }}
                    value={fontOptions.paddingVertical} 
                    min={6} 
                    type="range" name="" id="" />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>Text Size</span>
                      <Input className='w-24 h-9 cursor-pointer' 
                    onChange={(e)=>{
                        setFontOptions((prev)=>({
                            ...prev,
                            textSize:parseInt(e.target.value)
                        }))
                    }}
                    max={20}
                    min={13}
                    value={fontOptions.textSize}  
                    type="range" name="" id="" />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>Title Size</span>
                      <Input className='w-24 h-9 cursor-pointer' 
                    onChange={(e)=>{
                        setFontOptions((prev)=>({
                            ...prev,
                            titleSize:parseInt(e.target.value)
                        }))
                    }}
                    max={20}
                    min={13}
                    value={fontOptions.titleSize}  
                    type="range" name="" id="" />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>Space Content</span>
                      <Input className='w-24 h-9 cursor-pointer' 
                    onChange={(e)=>{
                        setFontOptions((prev)=>({
                            ...prev,
                            SpaceContent:parseInt(e.target.value)
                        }))
                    }}
                    max={40}
                    min={5}
                    value={fontOptions.SpaceContent}  
                    type="range" name="" id="" />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>Space Inside</span>
                      <Input className='w-24 h-9 cursor-pointer' 
                    onChange={(e)=>{
                        setFontOptions((prev)=>({
                            ...prev,
                            SpaceInside:parseInt(e.target.value)
                        }))
                    }}
                    max={40}
                    min={0}
                    value={fontOptions.SpaceInside}  
                    type="range" name="" id="" />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>Select Font</span>
                     <FontSelector/>
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>Affichage en une Ligne</span>
                     <Switch  checked={fontOptions.displayOneLine}
            onCheckedChange={(checked) => {
              setFontOptions((prev) => ({
                ...prev,
                displayOneLine: checked ,
              }))
            }}
            />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>Affichage en une Ligne pour la date</span>
                     <Switch  checked={fontOptions.diplayDateLine}
            onCheckedChange={(checked) => {
              setFontOptions((prev) => ({
                ...prev,
                diplayDateLine: checked ,
              }))
            }}
            />
        </div>
        <div className='w-full flex items-center justify-between'>
                    <span>Affichage en une Ligne pour les Langues</span>
                     <Switch  checked={fontOptions.diplayLanguageLine}
            onCheckedChange={(checked) => {
              setFontOptions((prev) => ({
                ...prev,
                diplayLanguageLine: checked ,
              }))
            }}
            />
        </div>
       
    </div>
  )
}

export default Options
