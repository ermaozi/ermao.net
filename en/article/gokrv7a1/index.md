---
url: /en/article/gokrv7a1/index.md
description: >-
  Install MongoDB Database Tools on Ubuntu, choose JSON export or BSON backup,
  restore data safely, and troubleshoot duplicate keys and authentication.
---
These notes cover moving a limited production-data sample into a development environment with MongoDB's command-line tools.

::: warning Protect production data
Export only data you are authorized to use. Remove or anonymize personal and secret values before moving a production sample into development, encrypt backup files at rest, and delete temporary copies when the test is complete.
:::

## Choose the correct tool

MongoDB separates logical data interchange from full-fidelity database backups:

| Task | Export | Import or restore | Format |
| --- | --- | --- | --- |
| One collection for interchange | `mongoexport` | `mongoimport` | JSON, CSV, or TSV |
| Database or multiple collections | `mongodump` | `mongorestore` | BSON plus metadata |

Use `mongodump` and `mongorestore` when indexes, BSON types, and collection metadata matter. JSON produced by `mongoexport` is not a replacement for a complete backup.

## Install MongoDB Database Tools

The old `apt-key` and Ubuntu `focal` repository commands in the original 2024 note are no longer a good installation path for Ubuntu 22.04. Follow MongoDB's current [Database Tools installation guide](https://www.mongodb.com/docs/database-tools/installation/?operating-system=linux\&package-type=deb), download the `.deb` package matching the CPU architecture, and install that local file:

```bash
sudo apt install ./mongodb-database-tools-*.deb
```

Confirm the installed versions:

```bash
mongoexport --version
mongodump --version
```

The Database Tools release lifecycle is separate from the MongoDB Server release, so do not infer the tool version from a server package name.

## Export data

### Export one collection as JSON

```bash
mongoexport \
  --uri="mongodb://localhost:27017/mydatabase" \
  --collection=mycollection \
  --out=output.json
```

For newline-delimited JSON, each document is written as a separate JSON value. Read the current `mongoexport` documentation before selecting JSON-array or CSV options for another consumer.

### Dump one database as BSON

```bash
mongodump \
  --uri="mongodb://localhost:27017/mydatabase" \
  --out=output
```

### Dump every accessible database

```bash
mongodump \
  --uri="mongodb://localhost:27017" \
  --out=output
```

The account in the connection string must have permission to read every selected database.

## Import or restore data

First restore into an isolated, empty test environment after confirming the target URI and dump contents. Even without `--drop`, these commands write data and may encounter duplicate keys. Take an independent backup before any intended replacement.

### Import one JSON collection

```bash
mongoimport \
  --uri="mongodb://localhost:27017/mydatabase" \
  --collection=mycollection \
  --file=output.json
```

### Restore one database

```bash
mongorestore \
  --uri="mongodb://localhost:27017" \
  --nsInclude='mydatabase.*' \
  output
```

### Restore all databases in a dump directory

```bash
mongorestore \
  --uri="mongodb://localhost:27017" \
  output
```

::: danger `--drop` deletes destination collections
The examples above omit `--drop`. If deliberately enabled, it deletes the destination collections represented in the dump, not collections absent from the backup or the entire database. Restoring `admin` with `--drop` also replaces existing user credentials with users from the dump. Confirm the target and take an independent backup before considering this option. See the [official mongorestore reference](https://www.mongodb.com/docs/database-tools/mongorestore/).
:::

## Common problems

### `E11000 duplicate key error`

The destination already contains a document with a conflicting unique key. Choose the behavior intentionally:

* import into an empty collection;
* use `--drop` only when replacing that collection is safe;
* use the documented `mongoimport` upsert options when a specific key should update existing records;
* clean or remap conflicting data before import.

Do not add `--drop` merely to silence the error on an important database.

### The destination database already exists

`mongorestore` merges into existing collections unless instructed otherwise. Use `--drop` for a controlled replacement, or restore to a different namespace and compare the data before switching applications.

Use `mongoexport --query` only to select documents for a JSON/CSV export. It does not make `mongodump` or `mongorestore` a filtered full backup.

### `Authentication failed`

The user may have been created in `admin` while the application database appears in the path. Specify the authentication source in the URI:

```bash
mongoimport \
  --uri="mongodb://USERNAME:PASSWORD@localhost:27017/mydatabase?authSource=admin" \
  --collection=mycollection \
  --file=output.json
```

Avoid putting a real password in shell history or process listings. Prefer an approved secret mechanism or an interactive password option supported by the current tool. Also verify the username, roles, authentication mechanism, TLS requirements, and target host; an authentication error is not explained solely by the MongoDB server being newer than version 4.0.

## Verification

After an import or restore:

1. compare expected collection and document counts;
2. verify indexes and validation rules when using a BSON restore;
3. run application-level reads against the development copy;
4. inspect the tool output for skipped documents and errors;
5. remove the exported production sample when it is no longer required.
