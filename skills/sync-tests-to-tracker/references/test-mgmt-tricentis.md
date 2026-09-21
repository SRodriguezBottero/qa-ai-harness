# Tricentis / qTest adapter

Document the REST contract only. Endpoints, tokens, and folder ids live in `{{config.testManagement.folderTaxonomy}}` and the consumer env.

Required operations:

- `listFolders()` → tree
- `place(testCaseId, folderId)` → void
- Pagination: follow `links.next` until exhausted

Do not bake a production taxonomy into this file. Ship an example in `config/test-mgmt-folders.json`.
