

```bash
# On the VM
cd /opt/formflow

# Create the script
nano rollback.sh          # paste the content above, then save

# Make it executable
chmod +x rollback.sh

# Run a rollback (example)
./rollback.sh 1.0.0
```