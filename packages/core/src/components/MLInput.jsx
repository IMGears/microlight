import { FormControl, FormLabel,Input, Select, Option } from "@mui/joy";

export default function MLInput({def,slug,searchParams}){

  return <>
    <FormControl required={def.required} sx={{mb:2}}>
      <FormLabel sx={{mb:0.25}}>{def.name}:</FormLabel>
      {['string', 'number', 'date'].includes(def.type) && (
        <Input 
          size= "sm"
          name= {slug}
          placeholder= {def.placeholder}
          defaultValue= {searchParams[slug] || def.default || ""}
          type={def.type}
        />
      )}
      {def.type === 'file' && (
        // Placeholder for future file input implementation
        <Input 
          size="sm"
          name={slug}
          placeholder={def.placeholder}
          type="file"
          // Add any file-specific props here
        />
      )}
      {def.type === 'dropdown' && (
        <Select
          size="sm"
          name={slug}
          placeholder={def.placeholder}
          defaultValue= {searchParams[slug] || def.default || ""}
        >
          {def.options?.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label || option.value}
            </Option>
          ))}
        </Select>
      )}
    </FormControl>
    {/* string input - {slug} <br/> */}
    {/* <pre>{JSON.stringify(def,null,2)}</pre> */}
  </>
}