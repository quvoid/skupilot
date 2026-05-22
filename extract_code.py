import json
import os

log_path = r"C:\Users\omkar\.gemini\antigravity\brain\64f4de86-bd86-4d86-89d1-e6d8e2a8f39b\.system_generated\logs\overview.txt"
output_root = r"c:\Users\omkar\.gemini\antigravity\scratch\catalevo"

files_content = {}

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
        except:
            continue
        
        step_index = data.get('step_index', 0)
        if step_index >= 161:
            continue
            
        tool_calls = data.get('tool_calls', [])
        for call in tool_calls:
            name = call.get('name')
            args = call.get('args', {})
            
            if name == 'write_to_file':
                target_file = args.get('TargetFile', '').strip('"')
                # Map paths from scratch to output_root
                if 'scratch\\catalevo' in target_file.lower():
                    rel_path = target_file.lower().split('scratch\\catalevo\\')[-1]
                    target_file = os.path.join(output_root, rel_path)
                
                content = args.get('CodeContent', '').strip('"')
                # Unescape common characters in JSON strings
                content = content.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\').replace('\\/', '/')
                
                files_content[target_file] = content

# Write the files
for path, content in files_content.items():
    if not path: continue
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        print(f"Restored: {path}")
