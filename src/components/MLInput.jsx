import { FormControl, FormLabel,Input } from "@mui/joy";

export default function MLInput({def,slug}){

  return <>
    <FormControl required={def.required} sx={{mb:2}}>
      <FormLabel sx={{mb:0.25}}>{def.name}:</FormLabel>
      {['string', 'number', 'date'].includes(def.type) && (
        <Input 
          size= "sm"
          name= {slug}
          placeholder= {def.placeholder}
          defaultValue= {def.default || ""}
          type={def.type}
        />
      )}
      {def.type === 'file' && (
        // Placeholder for future file input implementation
        <Input 
          {...commonProps}
          type="file"
          // Add any file-specific props here
        />
      )}
    </FormControl>
    {/* string input - {slug} <br/> */}
    {/* <pre>{JSON.stringify(def,null,2)}</pre> */}
  </>
}