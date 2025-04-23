# Merge the new_feature branch allowing unrelated histories
git merge new_feature --allow-unrelated-histories

# If you encounter conflicts, resolve them and then:
git add .
git commit -m "Merged new_feature branch with unrelated history"
